import express from "express";
import ytdlp from "youtube-dl-exec";
import fs from "fs";
import path from "path";

const app = express();

app.get("/download", async (req, res) => {
  try {
    const { url, type } = req.query;

    if (!url) {
      return res.status(400).send("URL required");
    }

    const filename = `temp/download_${Date.now()}`;
    const outputPath =
      type === "audio"
        ? `${filename}.mp3`
        : `${filename}.mp4`;

    if (type === "video") {
      await ytdlp(url, {
        format: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best",
        mergeOutputFormat: "mp4",
        output: outputPath
      });
    } else {
      await ytdlp(url, {
        format: "bestaudio",
        extractAudio: true,
        audioFormat: "mp3",
        output: outputPath
      });
    }

    res.download(outputPath, () => {
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed");
  }
});

app.listen(3000, () =>
  console.log("Server running and ready")
);
