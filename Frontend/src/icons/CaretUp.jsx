import React from "react";

export default function CaretUp({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        class="fa-solid fa-caret-up upicon"
        onClick={onClick}
        style={{ display: "inline-block", ...styles }}
      ></i>
    </div>
  );
}
