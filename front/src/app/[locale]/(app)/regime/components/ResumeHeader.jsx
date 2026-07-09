import Image from "next/image";
import {
  MdEmail,
  MdLocationOn,
  MdLanguage,
  MdUpdate,
} from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import styles from "./ResumeHeader.module.css";

export default function ResumeHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.photoWrap}>
        <Image
          src="/images/profile.webp"
          alt="Junichi Sunada"
          width={150}
          height={150}
          className={styles.photo}
          priority
        />
      </div>

      <div className={styles.profile}>
        <div className={styles.nameRow}>
          <h1>砂田 潤一</h1>
          <span>Junichi Sunada</span>
        </div>

        <p className={styles.role}>
          Web Engineer / Educator / Curriculum Designer
        </p>

        <p className={styles.catch}>
          技術と教育をつなぎ、学ぶ人の「変化」を支援する人材へ。
        </p>

        <p className={styles.description}>
          ホテル業界での現場・社内システム開発経験を経て、Web開発と業務改善に幅広く従事。
          現在はルワンダの高校でプログラミング教育に携わり、学習者一人ひとりの成長を最大化する
          カリキュラム・学習体験の設計に取り組んでいます。
        </p>
      </div>
      
      <div className={styles.contact}>
                <div className={styles.updated}>
          <MdUpdate />
          <span>最終更新日：2026年7月10日</span>
        </div>
        <ContactItem
          icon={<MdEmail />}
          text="junsanjunsan14@gmail.com"
          href="mailto:junsanjunsan14@gmail.com"
        />

        <ContactItem
          icon={<MdLocationOn />}
          text="Kigali, Rwanda"
          href="https://www.google.com/maps/search/?api=1&query=Kigali%2C%20Rwanda"
        />

        <ContactItem
          icon={<FaGithub />}
          text="github.com/junsan14"
          href="https://github.com/junsan14"
        />

        <ContactItem
          icon={<MdLanguage />}
          text="junsan.info"
          href="https://junsan.info/"
        />
      </div>
    </header>
  );
}

function ContactItem({ icon, text, href }) {
  return (
    <div className={styles.contactItem}>
      <span className={styles.contactIcon}>{icon}</span>
      <span>
        <a
          href={href}
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {text}
        </a>
      </span>
    </div>
  );
}