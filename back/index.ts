import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { commentRouter } from "./routes/comment";
import { loginRouter } from "./routes/login";
import { postRouter } from "./routes/post";
import { topicsRouter } from "./routes/topics";
import { userRouter } from "./routes/user";
import { videoRouter } from "./routes/video";

mongoose
  .connect(process.env.REACT_APP_MONGO_URL!)
  .catch((err) => console.log("CONNECTION ERROR", err))
  .then(() => app.listen(5000))

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "30mb" }));

export let mainVideoBucket;
mongoose.connection.on("connected", () => {
  mainVideoBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "mainVideoBucket",
  });
});

app.get('/', (req, res) => {
	res.json({message: 'hi'})
})

app.use("/topic", topicsRouter);
app.use("/post", postRouter);
app.use('/video', videoRouter)
app.use("/login", loginRouter);
app.use("/user", userRouter);
app.use('/comment', commentRouter)
