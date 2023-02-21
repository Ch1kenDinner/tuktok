import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

export const upload = () => {
  const storage = new GridFsStorage({
    url: process.env.REACT_APP_MONGO_URL!,
    file(request, file) {
      return new Promise((resolve, _) => {
        resolve({ filename: file.originalname, bucketName: "mainVideoBucket" });
      });
    },
  });
	return multer({storage})
};
