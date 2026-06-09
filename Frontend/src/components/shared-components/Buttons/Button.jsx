import { useState, useRef, useLayoutEffect } from "react";
import styles from "./Button.module.css";

export default function Button({
  type = "submit",
  btnText,
  onClick = () => {},
  form,
  variant = "md",
  disabled = false,
  customStyles = {},
}) {
    const buttonRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState();
const [buttonHeight, setButtonHeight] = useState();
  const buttonWidthStyle =
    disabled && buttonWidth ? { minWidth: buttonWidth } : undefined;
    const buttonHeightStyle =
    disabled && buttonHeight ? { minHeight: buttonHeight } : undefined;
  //const conditionalStyle = disabled ? { padding: "0.48rem 1.5rem" } : undefined;

  const variantStyles = {
    xs: {padding:"0.25rem 0.6rem",fontSize:"0.65rem"},
    sm: { padding: "0.4rem 1rem", fontSize: "0.8rem" },
    md: { padding: "0.5rem 1.4rem", fontSize: "0.95rem" },
  };

  useLayoutEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, []);
  return (
    <button
      form={form}
      ref={buttonRef}
      className={styles.btn}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{
        ...customStyles,
        ...variantStyles[variant],
        ...buttonWidthStyle,
        ...buttonHeightStyle,
      }}
    >
      <div className={styles.btnText}>{btnText}</div>
    </button>
  );
}
