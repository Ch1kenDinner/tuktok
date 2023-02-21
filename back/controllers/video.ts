import archiver from "archiver";
import mongoose from "mongoose";
import { mainVideoBucket } from "..";

export const getVideo = async (req, res) => {
  const { videoId } = req.params;

  const videos = await mainVideoBucket
    .find({ _id: new mongoose.Types.ObjectId(videoId) }).toArray()
  if (videos.length == 0)
    return res.status(404).json({ message: "Video not found!" });

  res.set("Content-Type", videos[0].contentType);
  res.set("Content-Disposition", `attachment; filename=${videos[0].filename}`);

  const fileStream = mainVideoBucket.openDownloadStream(
    new mongoose.Types.ObjectId(videoId)
  );
  fileStream.pipe(res);
};

export const getVideos = async (req, res) => {
  const videos: any[] = await mainVideoBucket.find().toArray();
  if (videos.length == 0) return res.json({ message: "Videos not found!" });

  res.set("Content-Type", videos[0].contentType);
  res.set("Content-Disposition", `attachment; filename=${videos[0].filename}`);

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(res);
  videos.forEach((file) => {
    const fileStream = mainVideoBucket.openDownloadStream(
      new mongoose.Types.ObjectId(file._id)
    );
    archive.append(fileStream, { name: file.filename });
  });

  archive.finalize();
};

export const postVideo = (req, res) => {
  try {
    res.status(200).json({ messgage: "Success video upload" });
  } catch (err) {
    res.json({ message: "ERROR! " + err });
  }
};
