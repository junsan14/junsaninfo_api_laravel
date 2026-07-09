import styles from "./Form.module.css";

export default function Label({ htmlFor, children, className = "", ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`${styles.label} ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}