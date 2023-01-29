import React from "react";

export default function Header({ text = "Header", className }) {
  return (
    <div class={className}>
      <h5 class="secondary-text">
        <strong>{text}</strong>
      </h5>
    </div>
  );
}
