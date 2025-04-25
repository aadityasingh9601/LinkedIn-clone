import React from "react";

export default function Input({ placeholder, register, name, options }) {
  console.log(options);
  return (
    <div>
      <input placeholder={placeholder} {...register(name, options)} />
    </div>
  );
}
