import { forwardRef } from "react";

import styles from "./Form.module.css";

const Checkbox = forwardRef(function Checkbox({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={`${styles.checkbox} ${className}`}
      {...props}
    />
  );
});

export default Checkbox;