const cp = require("child_process");
const binaries = require("ffmpeg-static");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

exports.mergeStreams = function (audioStream, videoStream) {
  const ffmpegProcess = cp.spawn(
    binaries,
    [
      "-loglevel",
      "0",
      "-hide_banner",
      "-i",
      "pipe:3",
      "-i",
      "pipe:4",
      "-c:v",
      "copy",
      "-f",
      "matroska",
      "pipe:5",
    ],
    {
      windowsHide: true,
      stdio: ["inherit", "inherit", "inherit", "pipe", "pipe", "pipe"],
    }
  );
  ffmpegProcess
    .on("close", () => {
      console.log("done");
    })
    .on("error", () => {
      console.log("Output stream was closed");
    });

  audioStream.pipe(ffmpegProcess.stdio[3]);
  videoStream.pipe(ffmpegProcess.stdio[4]);

  return ffmpegProcess.stdio[5];
};

exports.convertToMp3 = function (audioStream) {
  return ffmpeg(audioStream)
    .toFormat("mp3")
    .on("error", () => {
      console.log("Output stream was closed");
    });
};
