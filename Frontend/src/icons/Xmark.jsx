import React from "react";

export default function Xmark({ styles = {}, onClick = () => {} }) {
  return (
    <div>
      <i class="fa-solid fa-xmark cross" onClick={onClick} style={styles}></i>
    </div>
  );
}
