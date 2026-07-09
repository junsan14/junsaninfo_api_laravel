import styles from "./Form.module.css";

export default function FieldError({ messages = [], className = "" }) {
  if (!messages || messages.length === 0) return null;

  const errorMessages = Array.isArray(messages) ? messages : [messages];

  return (
    <div className={`${styles.error} ${className}`}>
      {errorMessages.map((message, index) => (
        <p key={index} className={styles.errorText}>
          {message}
        </p>
      ))}
    </div>
  );
}