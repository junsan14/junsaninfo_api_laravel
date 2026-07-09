import styles from "./Form.module.css";

export default function Button({
  type = "submit",
  className = "",
  disabled = false,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${styles.button} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}