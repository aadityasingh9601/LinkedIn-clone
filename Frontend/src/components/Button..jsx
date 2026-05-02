import { useState, useRef, useLayoutEffect } from "react";
import styles from "./Button.module.css";

export default function Button({
  type = "submit",
  btnText,
  onClick = () => {},
  disabled = false,
  customStyles = {},
}) {
  const [buttonWidth, setButtonWidth] = useState();
  const buttonRef = useRef(null);
  const buttonWidthStyle =
    disabled && buttonWidth ? { minWidth: buttonWidth } : undefined;
  const conditionalStyle = disabled ? { padding: "0.48rem 1.5rem" } : undefined;

  useLayoutEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, []);
  return (
    <button
      ref={buttonRef}
      className={styles.btn}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{
        ...customStyles,
        ...buttonWidthStyle,
        ...conditionalStyle,
      }}
    >
      {btnText}
    </button>
  );
}
