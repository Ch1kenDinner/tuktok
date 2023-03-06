import { Types } from "mongoose";
import { mainVideoBucket } from "..";

const CHUNK_SIZE = 1e6;

export const getVideo = async (req, res) => {
  const { videoId } = req.params;

  const [video] = await mainVideoBucket
    .find({ _id: new Types.ObjectId(videoId) })
    .toArray();
  if (!video) return res.status(404).json({ message: "Video not found!" });

	const {range} = req.headers
	if (!range) res.status(400).json({message: 'Range required'})

	const parts = req.headers.range.replace(/bytes=/, "").split("-");

	const startRange = parseInt(parts[0], 10);
	const endRange = Math.min(startRange + CHUNK_SIZE, video.length)

	const lengthRange = endRange - startRange

	const headers = {
		"Accept-Ranges": "bytes",
		"Content-Range": `bytes ${startRange}-${endRange}/${video.length}`,
		"Content-Length": lengthRange,
		"Content-Type": video.contentType,
	};

	res.writeHead(206, headers);

	const fileStream = await mainVideoBucket.openDownloadStream(
    new Types.ObjectId(videoId),
    {
      start: startRange,
      end: Math.min(startRange + CHUNK_SIZE, video.length),
    }
  );

	await fileStream.pipe(res);
};
// export const getVideo = async (req, res) => {
//   const { videoId } = req.params;

//   const [video] = await mainVideoBucket
//     .find({ _id: new Types.ObjectId(videoId) })
//     .toArray();
//   if (!video) return res.status(404).json({ message: "Video not found!" });

// 	const {range} = req.headers
// 	if (!range) res.status(400).json({message: 'Range required'})

// 	const parts = req.headers.range.replace(/bytes=/, "").split("-");

// 	const startRange = parseInt(parts[0], 10);
// 	const endRange = Math.min(startRange + CHUNK_SIZE, video.length - 1)

// 	const lengthRange = endRange - startRange

// 	const headers = {
// 		"Accept-Ranges": "bytes",
// 		"Content-Range": `bytes ${startRange}-${endRange}/${video.length}`,
// 		"Content-Length": lengthRange,
// 		"Content-Type": video.contentType,
// 	};

// 	res.writeHead(206, headers);

// 	const fileStream = await mainVideoBucket.openDownloadStream(
//     new Types.ObjectId(videoId),
//     {
//       start: startRange,
//       end: Math.min(startRange + CHUNK_SIZE, video.length),
//     }
//   );
// 	await fileStream.pipe(res);
// };