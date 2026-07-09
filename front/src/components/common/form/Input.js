import { forwardRef } from "react";

import styles from "./Form.module.css";

const Input = forwardRef(function Input(
  { className = "", type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={`${styles.input} ${className}`}
      {...props}
    />
  );
});

export default Input;