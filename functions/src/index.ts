import axios from 'axios';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { URLSearchParams } from 'url';
import Web3 from 'web3';

admin.initializeApp();

const IPFS_NODE =
  process.env.NODE_ENV === 'production' ? 'https://ipfs-node-fa5ujdlota-uc.a.run.app' : 'http://localhost:8081';
const web3 = new Web3('wss://mainnet.infura.io/ws/v3/e6e57d41c8b2411ea434bf96efe69f08');

const randomString = (length: number): string => {
  return [...Array(length)].map(_i => (~~(Math.random() * 36)).toString(36)).join('');
};

export const connectWallet = functions.https.onCall(async data => {
  const { address, signature } = data;

  if (!address) {
    throw new Error('need address');
  }

  const challenge = 'message';

  if (!signature) {
    return challenge;
  }

  const signedAddress = web3.eth.accounts.recover(challenge, signature);

  if (signedAddress !== address) {
    throw new Error('address used to sign challenge does not match');
  }

  const token = await admin.auth().createCustomToken(address);

  return token;
});

export const createAvatar = functions.https.onCall(async (_data, context) => {
  functions.logger.info(context.auth);
  if (!context.auth) {
    throw new Error('must be logged in');
  }

  const user = await admin.firestore().collection('users').doc(context.auth.uid).get();

  const avatarId = randomString(32);
  // eslint-disable-next-line
  let avatarData: any = {
    avatars: [avatarId],
  };

  if (user.exists) {
    avatarData = user.data();
    avatarData.avatars.push(avatarId);
  }

  await admin.firestore().collection('users').doc(context.auth.uid).set(avatarData, { merge: true });

  return avatarId;
});

export const storeIpfs = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new Error('must be logged in');
  }

  const { avatarId } = data;

  if (!avatarId) {
    throw new Error('no avatarId specified');
  }

  const avatars = await admin.firestore().collection('users').doc(context.auth.uid).get();

  if (!avatars.exists) {
    throw new Error('no avatars uploaded');
  }

  const avatarData = avatars.data();

  if (!avatarData || !avatarData.avatars.find((a: string) => a === avatarId)) {
    throw new Error('invalid avatarId');
  }

  const storageKey = `${context.auth.uid}/${avatarId}`;

  const [fileExists] = await admin.storage().bucket().file(storageKey).exists();

  if (!fileExists) {
    throw new Error('avatar not uploaded');
  }

  // call IPFS node
  const response = await axios.post(`${IPFS_NODE}/store`, {
    address: context.auth.uid,
    storageKey,
  });

  if (response.status === 200) {
    await admin.firestore().collection('users').doc(context.auth.uid).update({
      currentAvatar: avatarId,
      ipfs: response.data.ipfs,
      ipns: response.data.ipns,
    });

    return response.data;
  } else {
    return null;
  }
});

export const authDiscord = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new Error('must be logged in');
  }

  const { code, verifier } = data;

  try {
    const response = await axios({
      url: 'https://discord.com/api/oauth2/token',
      method: 'POST',
      data: new URLSearchParams({
        client_id: '871783976115798036',
        client_secret: 'ILh21Ji_TpiKoDdjQKNcEHwDgvhs87sf',
        grant_type: 'authorization_code',
        code: code,
        code_verifier: verifier,
        redirect_uri: 'http://localhost:19006',
      }).toString(),
    });

    functions.logger.info(response.data, { structuredData: true });

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;

    const userResponse = await axios({
      url: 'https://discord.com/api/v9/users/@me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    functions.logger.info(userResponse.data, { structuredData: true });

    const userId = userResponse.data.id;

    await admin.firestore().collection('users').doc(context.auth.uid).set(
      {
        discordUserId: userId,
        discordAccessToken: accessToken,
        discordRefreshToken: refreshToken,
        discordConnected: true,
      },
      { merge: true }
    );

    await updateDiscordAvatar(context.auth.uid);

    return true;
  } catch (e) {
    functions.logger.error(e, { structuredData: true });

    return false;
  }
});

const updateDiscordAvatar = async (userId: string) => {
  const user = await admin.firestore().collection('users').doc(userId).get();

  const userData = user.data();

  if (!user.exists || !userData) {
    throw new Error('could not find user');
  }

  if (!userData.currentAvatar) {
    throw new Error('no avatar set');
  }

  if (!userData.discordAccessToken) {
    throw new Error('discord not connected');
  }

  const accessToken = userData.discordAccessToken;
  const avatarId = userData.currentAvatar;
  const storageKey = `${userId}/${avatarId}`;

  const [fileExists] = await admin.storage().bucket().file(storageKey).exists();

  if (!fileExists) {
    throw new Error('avatar not uploaded');
  }

  const metadata = admin.storage().bucket().file(storageKey).metadata;

  const imageData = await new Promise<string>((resolve, reject) => {
    const stream = admin
      .storage()
      .bucket()
      .file(storageKey)
      .createReadStream({
        validation: process.env.NODE_ENV === 'production',
      });

    let data = '';

    stream.on('data', chunk => (data += chunk));
    stream.on('error', e => reject(e));
    stream.on('end', () => resolve(data));
  });

  const image = `data:${metadata.contentType};base64,${Buffer.from(imageData).toString('base64')}`;

  await axios({
    url: 'https://discord.com/api/v9/users/@me',
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: new URLSearchParams({
      avatar: image,
    }).toString(),
  });
};
