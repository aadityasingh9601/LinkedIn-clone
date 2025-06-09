import React from "react";

export default function CaretUp({ onClick }) {
  return (
    <div>
      <i class="fa-solid fa-caret-up upicon" onClick={onClick}></i>
    </div>
  );
}
