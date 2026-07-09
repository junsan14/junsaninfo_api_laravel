import { FaGithub, FaInstagram } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <nav className={styles.footerNav} aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Notes</Link>
          <Link href="/works">Works</Link>
          <Link href="/docs">Docs</Link>
        </nav>

        <div className={styles.brand}>
          <span>&copy; {year} JUNSAN14</span>
        </div>

        <div className={styles.snsGroup} aria-label="Social links">
          <Link href="/contact" aria-label="Contact">
            <MdEmail />
          </Link>

          <a
            href="https://github.com/junsan14"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>

          <a
            href="https://www.threads.net/@junsan_junsan14/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Threads"
          >
            <FaThreads />
          </a>

          <a
            href="https://www.instagram.com/junsan_junsan14"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>

    </footer>
  );
}