import styles from "./Modal.module.css";

import ReactDOM from "react-dom";

export default function Modal({ children }) {
  return ReactDOM.createPortal(
    <>
      <div className={`${styles.overlay}`}></div>
      <div className={`${styles.modal}`}>{children}</div>
    </>,
    document.getElementById("portal"),
  );
}
