import React from "react";

export default function CaretUp({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i
        class="fa-solid fa-caret-up upicon"
        onClick={onClick}
        style={styles}
      ></i>
    </div>
  );
}
