import Arweave from 'arweave';
import axios from 'axios';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import Twitter from 'twitter-lite';
import { URLSearchParams } from 'url';
import Web3 from 'web3';

const TWITTER_CONSUMER_KEY = functions.config().twitter.consumer_key;
const TWITTER_CONSUMER_SECRET = functions.config().twitter.consumer_secret;

admin.initializeApp();

const IPFS_NODE =
  process.env.NODE_ENV === 'production' ? 'https://ipfs-node-fa5ujdlota-uc.a.run.app' : 'http://localhost:8081';
const web3 = new Web3('wss://mainnet.infura.io/ws/v3/e6e57d41c8b2411ea434bf96efe69f08');
const arConfig =
  process.env.NODE_ENV === 'production'
    ? { host: 'arweave.net', port: 443, protocol: 'https' }
    : { host: 'localhost', port: 1984, protocol: 'http', logging: true };
const arweave = Arweave.init(arConfig);
const ARWEAVE_KEY = functions.config().arweave_key;

const randomString = (length: number): string => {
  return [...Array(length)].map(_i => (~~(Math.random() * 36)).toString(36)).join('');
};

export const connectWallet = functions.https.onCall(async data => {
  const { address, signature } = data;

  if (!address) {
    throw new Error('need address');
  }

  let challenge = `
Sign this message to login securely into davatar!

Nonce: ${randomString(32)}
  `;

  if (!signature) {
    await admin.firestore().collection('users').doc(address).set({ challenge }, { merge: true });

    return challenge;
  } else {
    const user = await admin.firestore().collection('users').doc(address).get();
    const userData = user.data() as { challenge?: string | null };

    if (userData.challenge) {
      challenge = userData.challenge;
    }
  }

  const signedAddress = web3.eth.accounts.recover(challenge, signature);

  if (signedAddress !== address) {
    throw new Error('address used to sign challenge does not match');
  }

  const token = await admin.auth().createCustomToken(address);

  if (!(await admin.firestore().collection('users').doc(address).get()).exists) {
    await admin.firestore().collection('users').doc(address).set({ avatars: [] });
  }

  return token;
});

export const createAvatar = functions.https.onCall(async (_data, context) => {
  functions.logger.info(context.auth);
  if (!context.auth) {
    throw new Error('must be logged in');
  }

  const user = await admin.firestore().collection('users').doc(context.auth.uid).get();
  const userData = user.data();

  if (!user.exists || !userData) {
    throw new Error('user does not exist');
  }

  const avatarId = randomString(32);
  const newAvatars = Array.isArray(userData.avatars) ? [...userData.avatars, avatarId] : [avatarId];

  await admin.firestore().collection('users').doc(context.auth.uid).set({ avatars: newAvatars }, { merge: true });

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

  const user = await admin.firestore().collection('users').doc(context.auth.uid).get();

  if (!user.exists) {
    throw new Error('no avatars uploaded');
  }

  const userData = user.data();

  if (!userData || !userData.avatars.find((a: string) => a === avatarId)) {
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

    if (userData.twitterConnected) {
      await updateTwitterAvatar(context.auth.uid);
    }

    return response.data;
  } else {
    return null;
  }
});

export const setAvatar = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new Error('must be logged in');
    }

    const { avatarId } = data;

    if (!avatarId) {
      throw new Error('no avatarId specified');
    }

    const user = await admin.firestore().collection('users').doc(context.auth.uid).get();

    if (!user.exists) {
      throw new Error('no avatars uploaded');
    }

    const userData = user.data();

    if (!userData || !userData.avatars.find((a: string) => a === avatarId)) {
      throw new Error('invalid avatarId');
    }

    const storageKey = `${context.auth.uid}/${avatarId}`;

    const [fileExists] = await admin.storage().bucket().file(storageKey).exists();

    if (!fileExists) {
      throw new Error('avatar not uploaded');
    }

    const imageData = await new Promise<Buffer>((resolve, reject) => {
      const stream = admin
        .storage()
        .bucket()
        .file(storageKey)
        .createReadStream({
          validation: process.env.NODE_ENV === 'production',
        });

      const buffer: Uint8Array[] = [];

      stream.on('data', chunk => buffer.push(chunk));
      stream.on('error', e => reject(e));
      stream.on('end', () => resolve(Buffer.concat(buffer)));
    });

    const [metadata] = await admin.storage().bucket().file(storageKey).getMetadata();

    const transaction = await arweave.createTransaction({ data: imageData }, ARWEAVE_KEY);
    transaction.addTag('Content-Type', metadata.contentType);
    transaction.addTag('App-Name', 'davatar.xyz');

    // The Origin tag allows us to support "mutable" records, a draft spec being worked on with Arweave team
    if (userData.avatarProtocol === 'arweave') {
      transaction.addTag('Origin', userData.avatarId);
    }

    await arweave.transactions.sign(transaction, ARWEAVE_KEY);

    const uploader = await arweave.transactions.getUploader(transaction);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
    }

    await admin.firestore().collection('users').doc(context.auth.uid).update({
      currentAvatar: avatarId,
      avatarProtocol: 'arweave',
      avatarId: transaction.id,
    });

    if (userData.avatarProtocol === 'arweave') {
      return { avatarProtocol: userData.avatarProtocol, avatarId: userData.avatarId };
    } else {
      return { avatarProtocol: 'arweave', avatarId: transaction.id };
    }
  } catch (e) {
    functions.logger.error(e, { structuredData: true });
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

    await admin.firestore().collection('users').doc(`${context.auth.uid}/private`).set(
      {
        discordUserId: userId,
        discordAccessToken: accessToken,
        discordRefreshToken: refreshToken,
      },
      { merge: true }
    );
    await admin.firestore().collection('users').doc(context.auth.uid).set(
      {
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
  const user = await admin.firestore().collection('users').doc(`${userId}/private`).get();

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

export const requestTwitterToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new Error('not logged in');
  }

  const twitter = new Twitter({
    consumer_key: TWITTER_CONSUMER_KEY,
    consumer_secret: TWITTER_CONSUMER_SECRET,
  });

  const response = await twitter.getRequestToken(data.redirectUri);

  return response;
});

export const connectTwitter = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new Error('not logged in');
  }

  try {
    const preAuth = new Twitter({
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
    });

    const response = await preAuth.getAccessToken({
      oauth_token: data.oauthToken,
      oauth_verifier: data.oauthVerifier,
    });

    const twitter = new Twitter({
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
      access_token_key: response.oauth_token,
      access_token_secret: response.oauth_token_secret,
    });

    const profile = await twitter.get('account/verify_credentials');

    await admin.firestore().collection('users').doc(`${context.auth.uid}/private`).set(
      {
        twitterHandle: profile.screen_name,
        twitterAccessToken: response.oauth_token,
        twitterAccessTokenSecret: response.oauth_token_secret,
      },
      { merge: true }
    );
    await admin.firestore().collection('users').doc(context.auth.uid).set(
      {
        twitterConnected: true,
      },
      { merge: true }
    );

    const user = await admin.firestore().collection('users').doc(context.auth.uid).get();
    const userData = user.data() as { twitterConnected: boolean };

    if (userData.twitterConnected) {
      await updateTwitterAvatar(context.auth.uid);
    }

    return true;
  } catch (e) {
    functions.logger.error(e);

    return false;
  }
});

const updateTwitterAvatar = async (userId: string) => {
  const user = await admin.firestore().collection('users').doc(`${userId}/private`).get();

  const userData = user.data();

  if (!user.exists || !userData) {
    throw new Error('could not find user');
  }

  if (!userData.currentAvatar) {
    throw new Error('no avatar set');
  }

  if (!userData.twitterAccessToken) {
    throw new Error('twitter not connected');
  }

  const avatarId = userData.currentAvatar;
  const storageKey = `${userId}/${avatarId}`;

  const [fileExists] = await admin.storage().bucket().file(storageKey).exists();

  if (!fileExists) {
    throw new Error('avatar not uploaded');
  }

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

  const image = Buffer.from(imageData).toString('base64');

  const twitter = new Twitter({
    consumer_key: TWITTER_CONSUMER_KEY,
    consumer_secret: TWITTER_CONSUMER_SECRET,
    access_token_key: userData.twitterAccessToken,
    access_token_secret: userData.twitterAccessTokenSecret,
  });

  await twitter.post('account/update_profile_image', { image });
};
