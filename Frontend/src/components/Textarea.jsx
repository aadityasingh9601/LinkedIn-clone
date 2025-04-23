import React from "react";
import MyErrorBoundary from "./MyErrorBoundary";

export default function Textarea({ placeholder, register, name }) {
  return (
    <MyErrorBoundary>
      <div>
        <textarea {...register(name)} placeholder={placeholder}></textarea>
      </div>
    </MyErrorBoundary>
  );
}
