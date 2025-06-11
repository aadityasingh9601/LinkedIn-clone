import React from "react";

export default function ThumbsupR({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i
        className="fa-regular fa-thumbs-up"
        style={styles}
        onClick={onClick}
      ></i>
    </div>
  );
}
