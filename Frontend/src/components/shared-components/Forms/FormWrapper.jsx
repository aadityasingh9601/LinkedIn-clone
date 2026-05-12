import styles from "./FormWrapper.module.css";

export default function FormWrapper({ onSubmit, children, className = "", id= "", ...rest }) {
  return (
    <div className={`${styles.formWrapper} ${className}`}>
      <form id={id} onSubmit={onSubmit} {...rest}>
        {children}
      </form>
    </div>
  );
}
