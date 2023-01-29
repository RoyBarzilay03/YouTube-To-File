import React from "react";
import Image from "react-bootstrap/Image";

export default function Logo({ showSubline = true, className }) {
  return (
    <div class={className}>
      <Image src="Full Logo.png" width={250} />
      {showSubline && (
        <p class="secondary-text">
          by <strong class="secondary-text-light">Roy Barzilay</strong>
        </p>
      )}
    </div>
  );
}
