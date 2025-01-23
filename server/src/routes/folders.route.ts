import { Router } from "express";
import passport from "passport";
import type { User } from ".prisma/client";
import prisma from "../config/prisma";
import { ListObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

const router = Router();

const client = new S3Client({ region: process.env.AWS_REGION });

router.use(passport.authenticate("jwt", { session: false }));

//@ts-ignore
router.get("/", (req, res) => {
    console.log("body - ", req.body);
    console.log("user - ", req.user);
    const { id, email, name } = req.user as User;
    const listObjectCommand = new ListObjectsCommand({
        Bucket: process.env.AWS_S3_Bucket_Name,
        Prefix: id
    });

    prisma.folder.findMany({
        where: {
            userId: id
        }
    }).then((folders) => {
        // console.log("folders - ", folders);
        res.status(200).json(folders);
    }).catch((err) => {
        console.log("err - ", err);
        res.status(400).json({ message: "Error in fetching folders" });
    });



});

// @ts-ignore
router.post("/", (req, res) => {
    const { path, name } = req.body;
    console.log("path - ", path);
    console.log("name - ", name);
    if (!name) {
        return res.status(400).json({ message: "Folder name is required" });
    }
    const { id } = req.user as User;
    let folderPath = "";
    if (path === "") {
        folderPath = `${id}/${name}/`;
    } else {
        folderPath = `${id}/${path}/${name}/`;
    }

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_Bucket_Name,
        Key: folderPath,
        Body: ""
    });

    prisma.folder.create({
        data: {
            id: folderPath,
            name: name,
            path: folderPath,
            userId: id
        }
    }).then((folder) => {
        console.log("Folder created in database", folder);
    }).catch((err) => {
        console.log("Error in creating folder in database", err);
        res.status(400).json({ message: "Error in creating folder in database" });
    });

    client.send(putObjectCommand).then((data) => {
        console.log("Folder created successfully", data);
        res.status(201).json({ message: "Folder created successfully" });
    }).catch((err) => {
        console.log("Error in creating folder", err);
        res.status(400).json({ message: "Error in creating folder" });
    });
});

export default router;
