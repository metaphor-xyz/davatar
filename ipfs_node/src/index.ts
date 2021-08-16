import IPFS from 'ipfs-core';
import express from 'express';
import fileUpload from 'express-fileupload';
import admin from 'firebase-admin';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8081;

admin.initializeApp({
  projectId: "drop---avatars",
  storageBucket: "drop---avatars.appspot.com",
});

(async function() {
  const ipfs = await IPFS.create({
    repo: './data',
  });
  const updateAvatar = async (address: string, file: any) => {
    if (!(await ipfs.key.list()).find(k => k.name === address)) {
      await ipfs.key.gen(address);
    }

    const ipfsFile = await ipfs.add(file);
    const ipns = await ipfs.name.publish(ipfsFile.cid);//, { key: address });
    console.log(ipns);

    return ipns.name;
  };

  const app = express();

  app.use(fileUpload({
    limits: { fileSize: 50*1024*1024 },
  }));
  app.use(express.json());
  app.use(express.urlencoded( { extended: true }));

  app.post('/store', async (req, res) => {
    const { address, storageKey } = req.body;
    console.log(req.body);

    if (!address) {
      res.status(400).send('missing address');
      return;
    }

    if (!storageKey) {
      res.status(400).send('missing storageKey');
      return;
    }

    const [exists] = await admin.storage().bucket().file(storageKey).exists();

    if (!exists) {
      res.status(400).send('file does not exist');
      return;
    }

    try {
      const stream = admin.storage().bucket().file(storageKey).createReadStream({
        validation: false,
      });

      const ipns = await updateAvatar(address, stream);

      res.status(200).json({ type: 'ipns', hash: ipns });
    } catch (e) {
      console.error(e);
      res.status(500).send('file upload failed!');
    }
  });

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
})()

