/*global chrome*/

const SERVER_BASE_URL = "http://youtube-to-file.lm.r.appspot.com/";

chrome.runtime.onMessage.addListener((message) => {
  switch (message) {
    case "open-output-folder":
      chrome.downloads.showDefaultFolder();
      break;
    default:
      break;
  }
});

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case "download-current":
      downloadCurrentTab();
      break;
    case "download-all":
      downloadAllTabs();
      break;
    case "download-playlist":
      downloadPlaylist();
      break;
    default:
      break;
  }
});

async function downloadCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const { isValid } = await (
    await fetch(`${SERVER_BASE_URL}validate?URL=${tab.url}`)
  ).json();
  if (isValid) downloadURL(tab.url);
}

async function downloadAllTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });

  tabs.forEach(async (tab) => {
    const { isValid } = await (
      await fetch(`${SERVER_BASE_URL}validate?URL=${tab.url}`)
    ).json();
    if (isValid) downloadURL(tab.url);
  });
}

async function downloadPlaylist() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const { URLs } = await (
    await fetch(`${SERVER_BASE_URL}playlist?URL=${tab.url}`)
  ).json();

  console.log(URLs);

  URLs.forEach(async (url) => {
    const { isValid } = await (
      await fetch(`${SERVER_BASE_URL}validate?URL=${url}`)
    ).json();
    if (isValid) downloadURL(url);
  });
}

function downloadURL(URL) {
  chrome.storage.local
    .get(["fileFormat", "nameOption", "customName"])
    .then(({ fileFormat, nameOption, customName }) => {
      let audioOnly = false;
      let videoOnly = false;
      const useCustomName = nameOption === "Custom Name";

      switch (fileFormat) {
        case "Audio Only":
          audioOnly = true;
          break;
        case "Muted Audio":
          videoOnly = true;
          break;
        default:
          break;
      }

      chrome.downloads.download({
        url: `${SERVER_BASE_URL}download?URL=${URL}&audioOnly=${audioOnly}&videoOnly=${videoOnly}&useCustomName=${useCustomName}&customName=${
          customName || "X"
        }`,
      });
    });
}
