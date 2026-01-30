import express from "express";
import ytdlp from "youtube-dl-exec";
import path from "path";
import fs from "fs";

const app = express();

app.get("/download", async (req, res) => {
  const { url, type } = req.query;

  const filename = `download_${Date.now()}`;

  const outputPath =
    type === "audio"
      ? `${filename}.mp3`
      : `${filename}.mp4`;

  await ytdlp(url, {
    format:
      type === "audio"
        ? "bestaudio"
        : "bestvideo+bestaudio",
    mergeOutputFormat: type === "audio" ? "mp3" : "mp4",
    output: outputPath
  });

  res.download(outputPath, () => {
    fs.unlinkSync(outputPath);
  });
});

app.listen(3000);
