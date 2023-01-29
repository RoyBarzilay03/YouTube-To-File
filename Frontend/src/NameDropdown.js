/*global chrome*/
import React, { useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export default function NameDropdown({
  nameOptions,
  nameOption,
  setNameOption,
}) {
  const handleNameOptionSelect = (event) => {
    setNameOption(event);
  };

  useEffect(() => {
    chrome.storage.local.get(["nameOption"]).then(({ nameOption }) => {
      setNameOption(nameOption || nameOptions[0]);
    });
  }, []);

  return (
    <DropdownButton
      title={nameOption}
      onSelect={handleNameOptionSelect}
      variant="outline-secondary"
      size="sm"
    >
      {nameOptions.map((option) => (
        <Dropdown.Item eventKey={option} active={nameOption === option}>
          {option}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
