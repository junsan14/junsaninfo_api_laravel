import styles from "./SectionHeading.module.css";

export default function SectionHeading({
  label,
  title,
  lead,
  align = "left",
  className = "",
}) {
  return (
    <div className={`${styles.heading} ${styles[align]} ${className}`}>
      {label && <p className={styles.label}>{label}</p>}

      <h2 className={styles.title}>{title}</h2>

      {lead && <p className={styles.lead}>{lead}</p>}
    </div>
  );
}