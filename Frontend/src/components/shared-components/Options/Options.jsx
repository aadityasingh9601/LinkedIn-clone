import styles from "./Options.module.css";
import Ellipsis from "../Icons/Ellipsis";
import Pen from "../Icons/Pen";
import Trash from "../Icons/Trash";

export default function Options({ show, setShow, setEdit, setDelete }) {
  return (
    <div className={styles.options}>
      <div className={styles.optionsBtn} onClick={() => setShow(!show)}>
        <Ellipsis />
      </div>

      {show && (
        <div className={styles.optionsBox}>
          <button
            onClick={() => {
              setShow(false);
              setEdit(true);
            }}
          >
            <Pen />
            Edit
          </button>
          <button
            onClick={() => {
              setDelete(true);
              // setToggle(false);
            }}
          >
            <Trash />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
