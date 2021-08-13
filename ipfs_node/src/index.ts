import IPFS from 'ipfs-core';
import express from 'express';
import fileUpload from 'express-fileupload';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

function isFile(file: fileUpload.UploadedFile | fileUpload.UploadedFile[] | undefined): file is fileUpload.UploadedFile {
  return file !== undefined;
}

(async function() {
  const ipfs = await IPFS.create({ repo: './data' });
  const updateAvatar = async (address: string, file: any) => {
    if (!(await ipfs.key.list()).find(k => k.name === address)) {
      await ipfs.key.gen(address);
    }

    const ipfsFile = await ipfs.add(file);
    const ipns = await ipfs.name.publish(ipfsFile.cid, { key: address });

    return ipns.name;
  };

  const app = express();

  app.use(fileUpload({
    limits: { fileSize: 50*1024*1024 },
  }));
  app.use(express.json());
  app.use(express.urlencoded( { extended: true }));

  app.post('/store', async (req, res) => {
    const address = req.body.address;

    if (!address) {
      res.status(400).send('missing address');
      return;
    }

    const avatar = req.files?.avatar;

    if (!avatar || !isFile(avatar)) {
      res.status(400).send('missing avatar');
      return;
    }

    const ipns = await updateAvatar(address, avatar.data);

    res.status(200).json({ type: 'ipns', hash: ipns });
  });

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
})()

