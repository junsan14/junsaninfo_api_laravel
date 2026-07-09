import styles from "./Auth.module.css";

const AuthSessionStatus = ({ status, className = "", ...props }) => {
  if (!status) return null;

  return (
    <div className={`${styles.status} ${className}`} {...props}>
      {status}
    </div>
  );
};

export default AuthSessionStatus;