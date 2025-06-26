import React from "react";

export default function ThumbsupR({ styles = {}, onClick = () => {} }) {
  return (
    <div style={{ display: "inline-block" }}>
      <i
        className="fa-regular fa-thumbs-up"
        style={{ display: "inline-block", ...styles }}
        onClick={onClick}
      ></i>
    </div>
  );
}
