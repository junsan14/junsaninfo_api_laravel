import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";
import styles from "./HomeHero.module.css";

export default function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Frontend Engineer / Educator</p>

          <h1 className={styles.title}>
            <span>Working at the intersection</span>
            <span>of education and technology.</span>
          </h1>
        </div>

        <div className={styles.actions}>
          <Link href="/works" className={styles.primaryButton}>
            View Projects
            <MdArrowOutward />
          </Link>

          <a
            href="https://github.com/junsan14"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            <FaGithub />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}