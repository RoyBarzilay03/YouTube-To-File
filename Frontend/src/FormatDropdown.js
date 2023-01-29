/*global chrome*/
import React, { useState, useEffect } from "react";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export default function FormatDropdown({ formats }) {
  const [fileFormat, setFileFormat] = useState([]);

  const handleFileFormatSelect = (event) => {
    setFileFormat(event);
  };

  useEffect(() => {
    chrome.storage.local.get(["fileFormat"]).then(({ fileFormat }) => {
      setFileFormat(fileFormat || formats[0]);
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ fileFormat: fileFormat });
  }, [fileFormat]);

  return (
    <DropdownButton
      title={fileFormat}
      onSelect={handleFileFormatSelect}
      variant="outline-secondary"
      size="sm"
    >
      {formats.map((option) => (
        <Dropdown.Item eventKey={option} active={fileFormat === option}>
          {option}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
