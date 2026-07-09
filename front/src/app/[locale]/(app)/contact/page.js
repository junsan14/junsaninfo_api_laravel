"use client";

import { useState } from "react";
import useSWRMutation from "swr/mutation";
import {
  FaPaperPlane,
  FaCircleCheck,
  FaTriangleExclamation,
} from "react-icons/fa6";

import SectionHeading from "@/components/common/SectionHeading";
import styles from "./Contact.module.css";

const sendContact = async (url, { arg }) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("送信に失敗しました");
  }

  return res.json();
};

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { trigger, data, error, isMutating } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact/send`,
    sendContact
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await trigger(form);

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.contact}>
        <div className="innerNarrow">
          <SectionHeading
            title="CONTACT"
            lead="お気軽にご連絡ください"
          />

          <form onSubmit={handleSubmit} className={styles.form} id="form">
            <div className={styles.fieldGrid}>
              <div className={styles.formItem}>
                <label htmlFor="name">NAME</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formItem}>
                <label htmlFor="email">EMAIL</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className={styles.formItem}>
              <label htmlFor="subject">SUBJECT</label>
              <input
                id="subject"
                type="text"
                name="subject"
                autoComplete="off"
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.formItem}>
              <label htmlFor="message">MESSAGE</label>
              <textarea
                id="message"
                name="message"
                rows="8"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isMutating}
            >
              <FaPaperPlane />
              {isMutating ? "SENDING..." : "SEND MESSAGE"}
            </button>

            {error && (
              <p className={`${styles.status} ${styles.error}`}>
                <FaTriangleExclamation />
                Failed to send. Please try again.
              </p>
            )}

            {data && (
              <p className={`${styles.status} ${styles.success}`}>
                <FaCircleCheck />
                Successfully sent. Thank you for your message.
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}