import React, { useRef } from "react";
import Button from "react-bootstrap/Button";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function MiniButton({
  text = "Mini Button",
  className,
  onClick,
  tooltipText,
}) {
  const renderTooltip = (props) => <Tooltip {...props}>{tooltipText}</Tooltip>;

  return (
    <div className={className}>
      <OverlayTrigger
        placement="top"
        overlay={tooltipText ? renderTooltip : <></>}
      >
        <Button variant="outline-secondary" size="sm" onClick={onClick}>
          {text}
        </Button>
      </OverlayTrigger>
    </div>
  );
}
