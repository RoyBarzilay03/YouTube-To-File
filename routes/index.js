const {
  mergeStreams,
  convertToMp3,
} = require("../public/javascripts/streamManager");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const express = require("express");
const router = express.Router();

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
        const videoTitle = title.replace(/[^\x20-\x7E]+/g, "#");
        const channelName = ownerChannelName.replace(/[^\x20-\x7E]+/g, "#");
        const fileExtension = audioOnly ? "mp3" : "mp4";
        const audioStream = ytdl(URL, {
          quality: "highestaudio",
          filter: "audioonly",
        });
        const videoStream = ytdl(URL, {
          quality: "highestvideo",
          filter: "videoonly",
        });
        const filename = useCustomName
          ? customName
          : `${videoTitle} - ${channelName}`;

        res.header(
          "Content-Disposition",
          `attachment; filename="${filename}.${fileExtension}"`
        );

        if (audioOnly) {
          convertToMp3(audioStream).pipe(res);
          return;
        }

        if (videoOnly) {
          videoStream.pipe(res);
          return;
        }

        mergeStreams(audioStream, videoStream).pipe(res);
      })
      .catch((err) => {
        res.end();
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

module.exports = router;
