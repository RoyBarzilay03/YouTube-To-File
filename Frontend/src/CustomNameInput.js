/*global chrome*/
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function CustomNameInput({ className, tooltipText, show }) {
  const [customName, setCustomName] = useState();

  const handleCustomNameChange = (event) => {
    setCustomName(event.target.value);
  };

  useEffect(() => {
    chrome.storage.local.set({ customName: customName });
  }, [customName]);

  useEffect(() => {
    chrome.storage.local.get(["customName"]).then(({ customName }) => {
      setCustomName(customName);
    });
  }, []);

  const renderTooltip = (props) => <Tooltip {...props}>{tooltipText}</Tooltip>;

  return (
    <div className={className}>
      {show && (
        <OverlayTrigger
          placement="top"
          trigger="focus"
          overlay={tooltipText ? renderTooltip : <></>}
        >
          <Form.Control
            size="sm"
            type="text"
            placeholder="Enter Custom Name"
            maxLength={40}
            className="name-option-input"
            onChange={handleCustomNameChange}
            value={customName}
          />
        </OverlayTrigger>
      )}
    </div>
  );
}
