const cp = require("child_process");
const ffmpeg = require("ffmpeg-static");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const express = require("express");
const router = express.Router();

process.env.YTDL_NO_UPDATE = true;

router.get("/download", function (req, res, next) {
  try {
    const URL = req.query.URL;
    const audioOnly = req.query.audioOnly === "true";
    const videoOnly = req.query.videoOnly === "true";
    const useCustomName = req.query.useCustomName === "true";
    const customName = req.query.customName;

    ytdl
      .getBasicInfo(URL)
      .then(({ videoDetails: { title, ownerChannelName } }) => {
        const asciiVideoTitle = title.replace(/[^\x20-\x7E]+/g, "#");
        const asciiChannelName = ownerChannelName.replace(
          /[^\x20-\x7E]+/g,
          "#"
        );
        const filename = useCustomName
          ? customName
          : `${asciiVideoTitle} - ${asciiChannelName}`;
        const fileExtension = audioOnly ? "mp3" : "mp4";

        res.header(
          "Content-Disposition",
          `attachment; filename="${filename}.${fileExtension}"`
        );

        const audioStream = ytdl(URL, {
          quality: "highestaudio",
          filter: "audioonly",
        });
        const videoStream = ytdl(URL, {
          quality: "highestvideo",
          filter: "videoonly",
        });

        if (audioOnly) {
          audioStream.pipe(res);
          return;
        }

        if (videoOnly) {
          videoStream.pipe(res);
          return;
        }

        mergeStreams(videoStream, audioStream).pipe(res);
      });
  } catch (err) {
    res.end();
  }
});

router.get("/validate", function (req, res, next) {
  try {
    const URL = req.query.URL;
    res.json({ isValid: ytdl.validateURL(URL) });
  } catch (err) {
    res.end();
  }
});

router.get("/playlist", async function (req, res, next) {
  try {
    const URL = req.query.URL;
    const playlist = await ytpl(URL);
    res.json({ URLs: playlist.items.map((video) => video.url) });
  } catch (err) {
    res.end();
  }
});

const mergeStreams = (videoStream, audioStream) => {
  const ffmpegProcess = cp.spawn(
    ffmpeg,
    [
      // Remove ffmpeg's console spamming
      "-loglevel",
      "0",
      "-hide_banner",
      // input streams
      "-i",
      "pipe:3",
      "-i",
      "pipe:4",
      // map streams
      "-map",
      "0:v",
      "-map",
      "1:a",
      // keep video's codec
      "-c:v",
      "copy",
      // Define output container
      "-f",
      "mp4",
      "-movflags",
      "frag_keyframe+empty_moov",
      "pipe:5",
    ],
    {
      windowsHide: true,
      stdio: [
        /* Standard: stdin, stdout, stderr */
        "inherit",
        "inherit",
        "inherit",
        /* Custom: pipe:3, pipe:4, pipe:5 */
        "pipe",
        "pipe",
        "pipe",
      ],
    }
  );
  ffmpegProcess
    .on("spawn", () => {
      console.log("merging...");
    })
    .on("close", () => {
      console.log("done");
    });

  videoStream.pipe(ffmpegProcess.stdio[3]);
  audioStream.pipe(ffmpegProcess.stdio[4]);

  return ffmpegProcess.stdio[5];
};

module.exports = router;
