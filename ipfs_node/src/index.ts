/* eslint-disable no-console */
import { spawn } from 'child_process';
import express from 'express';
import fileUpload from 'express-fileupload';
import admin from 'firebase-admin';
import IPFS from 'ipfs-http-client';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8081;

admin.initializeApp({
  projectId: 'daovatar',
  storageBucket: 'daovatar.appspot.com',
});

(async function () {
  if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    const { path } = await import('go-ipfs');

    const daemon = spawn(path(), ['daemon'], {
      env: {
        IPFS_PATH: './data',
      },
    });

    daemon.stdout.on('data', d => console.log(d.toString()));
    daemon.stderr.on('data', d => console.error(d.toString()));
    daemon.on('close', () => console.error('daemon exited'));
  }

  const ipfs = IPFS.create({
    url: process.env.NODE_ENV === 'production' ? 'http://34.72.155.192:5001' : 'http://localhost:5001',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateAvatar = async (address: string, file: any) => {
    let key = (await ipfs.key.list()).find(k => k.name === address);
    if (!key) {
      key = await ipfs.key.gen(address);
    }

    console.log('adding file');
    const ipfsFile = await ipfs.add(file);
    console.log(`added ${ipfsFile.cid}`);
    console.log(`publishing to ${key.id}`);
    ipfs.name
      .publish(ipfsFile.cid, {
        key: address,
        resolve: false,
      })
      .then(ipns => console.log(ipns));

    return { ipns: `${key.id}`, ipfs: `${ipfsFile.cid.toString()}` };
  };

  const app = express();

  app.use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

      const hashes = await updateAvatar(address, stream);

      res.status(200).json(hashes);
    } catch (e) {
      console.error(e);
      res.status(500).send('file upload failed!');
    }
  });

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
})();
