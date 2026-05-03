import styles from "./Options.module.css";
import Ellipsis from "../Icons/Ellipsis";

export default function Options({ show, setShow }) {
  return (
    <div className={styles.options}>
      <div className={styles.optionsBtn} onClick={() => setShow(!show)}>
        <Ellipsis />
      </div>

      {show && (
        <div className={styles.optionBox}>
          {(type === "post" || type == "comment") && (
            <button
              onClick={() => {
                {
                  type === "comment"
                    ? setCommentEdit(true)
                    : seteditModal(true);
                  setToggle(false);
                }
              }}
            >
              <Pen />
              Edit
            </button>
          )}
          <button
            onClick={() => {
              setdeleteModal(true);
              setToggle(false);
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
