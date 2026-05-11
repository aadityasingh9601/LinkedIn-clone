import styles from "./FormWrapper.module.css";

export default function FormWrapper({ onSubmit, children, className = "", ...rest }) {
  return (
    <div className={`${styles.formWrapper} ${className}`}>
      <form onSubmit={onSubmit} {...rest}>
        {children}
      </form>
    </div>
  );
}
