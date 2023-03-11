import mongoose, { Types } from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { mainVideoBucket } from "..";
import fs from 'fs'

export const upload = () => {
  const storage = new GridFsStorage({
    url: process.env.REACT_APP_MONGO_URL!,
    file(req: any, file) {
      return new Promise((resolve, _) => {
				const videoId = new Types.ObjectId();
				req.videoId = videoId

        resolve({
					id: videoId,
          filename: file.originalname,
          bucketName: "mainVideoBucket",
        });
      });
    },
  });
	return multer({storage})
};