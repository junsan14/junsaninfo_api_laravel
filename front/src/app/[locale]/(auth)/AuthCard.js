import styles from "./Auth.module.css";

const AuthCard = ({ children }) => (
  <div className={styles.page}>
    <div className={styles.card}>{children}</div>
  </div>
);

export default AuthCard;