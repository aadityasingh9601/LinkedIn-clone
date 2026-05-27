import { useEffect } from "react";
import styles from "./Modal.module.css";

import ReactDOM from "react-dom";

export default function Modal({ children }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return ReactDOM.createPortal(
    <>
      <div className={`${styles.overlay}`}></div>
      <div className={`${styles.modal}`}>{children}</div>
    </>,
    document.getElementById("portal"),
  );
}
