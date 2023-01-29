/*global chrome*/
import React, { useState, useEffect } from "react";
import Bowser from "bowser";

import Logo from "./Logo";
import Header from "./Header";
import FormatDropdown from "./FormatDropdown";
import ShortcutsListGroup from "./ShortcutsListGroup";
import MiniButton from "./MiniButton";
import NameDropdown from "./NameDropdown";
import CustomNameInput from "./CustomNameInput";
import Row from "react-bootstrap/Row";

function App() {
  const [nameOption, setNameOption] = useState([]);

  useEffect(() => {
    chrome.storage.local.set({ nameOption: nameOption });
  }, [nameOption]);

  const getBrowser = () => {
    const browser = Bowser.getParser(window.navigator.userAgent);

    return browser.getBrowserName();
  };

  const goToShortcutsPage = (event) => {
    const browser = getBrowser();

    chrome.tabs.create({
      url: `${browser.toLowerCase()}://extensions/shortcuts`,
    });
  };

  const goToDownloadSettings = (event) => {
    const browser = getBrowser();

    chrome.tabs.create({
      url: `${browser.toLowerCase()}://settings/downloads`,
    });
  };

  const openOutputFolder = (event) => {
    chrome.runtime.sendMessage("open-output-folder");
  };

  return (
    <>
      <Logo className="text-center mt-3 mb-1" />
      <hr class="hr-style" />

      <div className="ml-4 mr-4 mb-4 mt-4">
        <Row className="justify-content-between mb-2 ml-1 mr-1">
          <Header text="File Format" />
          <Header text="File Name" />
        </Row>
        <Row className="justify-content-between ml-1 mr-1">
          <FormatDropdown
            formats={["Video & Audio", "Audio Only", "Muted Audio"]}
          />
          <NameDropdown
            nameOptions={["Video Title", "Custom Name"]}
            nameOption={nameOption}
            setNameOption={setNameOption}
          />
        </Row>

        <Row className="justify-content-between ml-1 mr-1">
          <Header text="Keyboard Shortcuts" className="mt-4" />
          <CustomNameInput
            className="mt-2"
            tooltipText="There is no need to include file extension."
            show={nameOption === "Custom Name"}
          />
        </Row>
        <ShortcutsListGroup />
        <MiniButton
          text="Configure Shortcuts"
          className="text-center mt-2"
          onClick={goToShortcutsPage}
        />

        <Header text="Output Folder" className="mt-4 mb-2" />
        <Row className="justify-content-between ml-1 mr-1">
          <MiniButton
            text="Change Output Folder"
            onClick={goToDownloadSettings}
            tooltipText="It's only possible to change the output folder of the browser in general"
          />
          <MiniButton text="Open Output Folder" onClick={openOutputFolder} />
        </Row>
      </div>
    </>
  );
}

export default App;
