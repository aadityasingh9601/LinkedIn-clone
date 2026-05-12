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
    sm: { padding: "0.4rem 1rem", fontSize: "0.8rem" },
    md: { padding: "0.6rem 1.5rem", fontSize: "1rem" },
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
      {btnText}
    </button>
  );
}
