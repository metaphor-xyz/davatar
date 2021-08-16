import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Web3 from "web3";
import axios from "axios";

admin.initializeApp();

const IPFS_NODE = "http://localhost:8081";
const web3 = new Web3("wss://mainnet.infura.io/ws/v3/e6e57d41c8b2411ea434bf96efe69f08");

const randomString = (length: number): string => {
  return [...Array(length)].map((_i) => (~~(Math.random() * 36))
      .toString(36)).join("");
};

export const connectWallet = functions.https.onCall(async (data) => {
  const {address, signature} = data;

  if (!address) {
    throw new Error("need address");
  }

  const challenge = "message";

  if (!signature) {
    return challenge;
  }

  const signedAddress = web3.eth.accounts.recover(challenge, signature);

  if (signedAddress !== address) {
    throw new Error("address used to sign challenge does not match");
  }

  const token = await admin.auth().createCustomToken(address);

  return token;
});

export const createAvatar = functions.https.onCall(async (data, context) => {
  functions.logger.info(context.auth);
  if (!context.auth) {
    throw new Error("must be logged in");
  }

  const avatars = await admin.firestore().collection("avatars")
      .doc(context.auth.uid).get();

  const avatarId = randomString(32);
  let avatarData: any = {
    avatars: [avatarId],
    currentAvatar: null,
  };

  if (avatars.exists) {
    avatarData = avatars.data();
    avatarData.avatars.push(avatarId);
  }

  await admin.firestore().collection("avatars")
      .doc(context.auth.uid).set(avatarData);

  return avatarId;
});

export const storeIpfs = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new Error("must be logged in");
  }

  const {avatarId} = data;

  if (!avatarId) {
    throw new Error("no avatarId specified");
  }

  const avatars = await admin.firestore().collection("avatars")
      .doc(context.auth.uid).get();

  if (!avatars.exists) {
    throw new Error("no avatars uploaded");
  }

  const avatarData = avatars.data();

  if (!avatarData || !avatarData.avatars.find((a: string) => a === avatarId)) {
    throw new Error("invalid avatarId");
  }

  const storageKey = `${context.auth.uid}/${avatarId}`;

  const [fileExists] = await admin.storage().bucket()
      .file(storageKey).exists();

  if (!fileExists) {
    throw new Error("avatar not uploaded");
  }

  // call IPFS node
  const response = await axios.post(`${IPFS_NODE}/store`, {
    address: context.auth.uid,
    storageKey,
  });

  if (response.status === 200) {
    await admin.firestore().collection("avatars")
        .doc(context.auth.uid).update({
          ipns: response.data.hash,
        });

    return response.data;
  } else {
    return null;
  }
});

