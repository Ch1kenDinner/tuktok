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


export const uploadCustom = async (req, res, next) => {
	const {video} = req.body
	console.log('req.body', req.body)


	// if (!video) return res.status(404).json({message: 'Video not found'})

	const newVideoId = new mongoose.mongo.ObjectId()

	const uploadStream = mainVideoBucket.openUploadStream('someVideo', {_id: newVideoId})
	const readStream = fs.createReadStream(video)
	readStream.pipe(uploadStream)

	req.uploadedVideoId = newVideoId
	next()
}
