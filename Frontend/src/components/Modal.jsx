import "./Modal.css";
import ReactDOM from "react-dom";

export default function Modal({ children }) {
  return ReactDOM.createPortal(
    <>
      <div className="overlay"></div>
      <div className="modal">{children}</div>
    </>,
    document.getElementById("portal")
  );
}
