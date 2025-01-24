import { Router } from "express";
import passport from "passport";
import type { User } from ".prisma/client";
import prisma from "../config/prisma";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import S3 from "aws-sdk/clients/s3";

const router = Router();
const client = new S3Client({ region: process.env.AWS_REGION });

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});

router.use(passport.authenticate("jwt", { session: false }));
// @ts-ignore
router.post("/", (req, res) => {
  const { id, name, size, type, url } = req.body;
  const userId = (req.user as User).id;


  return Promise.resolve()
    .then(async () => {
      if (!name) throw new Error("Name is required!");
      if (!size) throw new Error("Size is required!");
      if (!type) throw new Error("Type is required!");
      if (!url) throw new Error("Url is required!");
      if (!userId) throw new Error("User ID is required!");

      const file = await prisma.file.create({
        data: {
          name,
          size,
          type,
          url,
          path: url,
          user: {
            connect: {
              id: userId,
            },
          },
        }
      })

      return res.status(200).json(file);
    })
    .catch((err) => {
      return res.status(400).json({ status: false, message: err.message });
    });
});

// @ts-ignore
router.post("/folder", async (req, res) => {
  const { folderId } = req.body;
  console.log("folderId - ", folderId);

  return Promise.resolve()
  .then(async () => {
    if (!folderId) throw new Error("Folder ID is required!");

    prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      include: {
        files: true,
      },
    }).then((folder) => {
      return res.status(200).json(folder);
    })
    .catch((err) => {
      return res.status(400).json({ status: false, message: err.message });
    });
  })
  .catch((err) => {
    return res.status(400).json({ status: false, message: err.message });
  });
});

// @ts-ignore
router.post("/sign-s3", async (req, res) => {
  const { path, fileName, fileType, } = req.body;
  const { id } = req.user as User;
  let folderPath = "", parentFodlerPath = "";
  if (path === "") {
    folderPath = `${id}/${fileName}`;
    parentFodlerPath = `${id}/`;
  } else {
    folderPath = `${id}/${path}/${fileName}`;
    parentFodlerPath = `${id}/${path}/`;
  }

  console.log("key - ", folderPath);

  await prisma.file.create({
    data: {
      name: fileName,
      size: 0, // Size will be updated later
      type: fileType,
      url: folderPath,
      path: folderPath,
      user: {
        connect: {
          id: id,
        },
      },
      Folder: {
        connect: {
          id: parentFodlerPath,
        },
      }
    },
  });

  const s3Params = {
    Bucket: process.env.AWS_S3_Bucket_Name,
    Key: folderPath,
    Expires: 60,
    ContentType: fileType,
  };
  // const command = new PutObjectCommand(s3Params);

  try {
    // const signedUrl = await getSignedUrlUtil(client, command, { expiresIn: 3600 });
    const signedUrl = await s3.getSignedUrl("putObject", s3Params);
    console.log("signedUrl - ", signedUrl);
    res.status(200).json({ signedUrl, key: folderPath });
  } catch (err) {
    console.log("err - ", err);
    res.status(400).json({ message: "Error in fetching signed url" });
  }
});

// @ts-ignore
router.post("/download", async (req, res) => {
  const { path, fileId, } = req.body;
  const { id } = req.user as User;
  let folderPath = ""
  let fileName = "";
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    console.log("file - ", file);
    if (!file) {
      return res.status(400).json({ message: "File not found" });
    }
    fileName = file.name;
    console.log("fileName - ", fileName);
    if (path === "") {
      folderPath = `${fileName}`;
    } else {
      folderPath = `${path}/${fileName}`;
    }
  } catch (err) {
    console.log("err - ", err);
    return res.status(400).json({ message: "Error in fetching file" });
  }
  console.log("fileName - ", fileName);

  console.log("key - ", folderPath);

  const s3Params = {
    Bucket: process.env.AWS_S3_Bucket_Name,
    Key: folderPath,
    Expires: 60,
  };
  // const command = new PutObjectCommand(s3Params);

  try {
    // const signedUrl = await getSignedUrlUtil(client, command, { expiresIn: 3600 });
    const signedUrl = await s3.getSignedUrl("getObject", s3Params);
    console.log("signedUrl - ", signedUrl);
    res.status(200).json({ signedUrl, key: fileName });
  } catch (err) {
    console.log("err - ", err);
    res.status(400).json({ message: "Error in fetching signed url" });
  }
});

export default router;

