import Link from "next/link";
import styles from "./CommonButton.module.css";

function CommonButton({
  href,
  children,
  icon,
  variant = "primary",
  external = false,
  className = "",
}) {
  const buttonClassName = `${styles.button} ${styles[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        className={buttonClassName}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>{children}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </a>
    );
  }

  return (
    <Link href={href} className={buttonClassName}>
      <span>{children}</span>
      {icon && <span className={styles.icon}>{icon}</span>}
    </Link>
  );
}

function ButtonAlign({ children, position = "default", className = "" }) {
  const alignClassName = `${styles.align} ${styles[position]} ${className}`;

  return <div className={alignClassName}>{children}</div>;
}

CommonButton.Align = ButtonAlign;

export default CommonButton;