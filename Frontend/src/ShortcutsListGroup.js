/*global chrome*/
import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";

export default function ShortcutsListGroup() {
  const [commands, setCommands] = useState([]);

  useEffect(() => {
    chrome.commands.getAll((storedCommands) => {
      setCommands(
        storedCommands.sort(
          (a, b) => a.description.slice(0, 1) - b.description.slice(0, 1)
        )
      );
    });
  }, []);

  return (
    <ListGroup variant="flush">
      {commands.map((command) => (
        <ListGroup.Item disabled>
          <small>
            <strong>{command.shortcut}</strong>
            <div className="float-right">{command.description.slice(2)}</div>
          </small>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
