import styles from "./Modal.module.css";
import Xmark from "../Icons/Xmark";
import Button from "../Buttons/Button";

export default function DeleteModal({ handleCancel, handleDelete }) {
  return (
    <>
      <Xmark onClick={handleCancel} />
      <div className={styles.deleteModal}>
        <div className={styles.deleteModalText}>
          Are you sure you want to delete this? This action isn't reversible!
        </div>
        <div className={styles.btns}>
          <Button
            btnText="Cancel"
            variant="sm"
            onClick={() => handleCancel(false)}
          />

          <Button
            btnText="Delete"
            variant="sm"
            onClick={handleDelete}
          />
        </div>
      </div>
    </>
  );
}
