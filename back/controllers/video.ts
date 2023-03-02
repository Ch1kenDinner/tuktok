import { Types } from "mongoose";
import { mainVideoBucket } from "..";


export const getVideo = async (req, res) => {
  const { videoId } = req.params;

  const [video] = await mainVideoBucket
    .find({ _id: new Types.ObjectId(videoId) })
    .toArray();
  if (!video) return res.status(404).json({ message: "Video not found!" });

  const startRange = Number(req.headers.range.replace(/\D/g, ""));
  const endVideo = video.length - 1;
  const lengthVideo = endVideo - startRange + 1;

  const headers = {
    "Content-Type": video.contentType,
    "Accept-Ranges": "bytes",
    "Content-Length": lengthVideo,
    "Content-Range": `bytes ${startRange}-${endVideo}/${video.length}`,
  };

  res.writeHead(206, headers);

  const fileStream = mainVideoBucket.openDownloadStream(
    new Types.ObjectId(videoId),
    { start: startRange, end: Math.min(startRange + 1000000, endVideo) }
  );
  fileStream.pipe(res);
};
