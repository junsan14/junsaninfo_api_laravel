import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

import SectionHeading from "@/components/common/SectionHeading";

import { SkillGraph } from "./SkillGraph";

import styles from "./page.module.css";

export default function About() {
  const t = useTranslations("About");

  const biography = [
    "1992",
    "2011",
    "2014",
    "2016",
    "2018",
    "2022",
    "2024 Jan-Mar",
    "2024 April-July",
    "2024 Sep-Now",
  ];

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div className="inner">
          <SectionHeading
            title="MYSELF"
            lead="My background, experience, and skills."
          />

          <div className={styles.profile}>
            <aside className={styles.profileCard}>
              <div className={styles.avatarWrap}>
                <Image
                  src="/profile.png"
                  className={styles.avatar}
                  alt="junsan14 profile"
                  width={150}
                  height={150}
                  priority
                />
              </div>

              <div className={styles.profileInfo}>
                <h3>junsan14</h3>
                <p>{t("job")}</p>
                <p>{t("jica")}</p>
              </div>

              <div className={styles.likesBox}>
                <p className={styles.likesTitle}>{t("likes_title")}</p>
                <p>{t("likes")}</p>
              </div>
            </aside>

            <div className={styles.timelineCard}>
              <dl className={styles.timeline}>
                {biography.map((key) => (
                  <React.Fragment key={key}>
                    <dt>{t(`biography.${key}.title`)}</dt>
                    <dd>{t(`biography.${key}.value`)}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="inner">
          <SectionHeading title="SKILL" />

          <div className={styles.skillCard}>
            <SkillGraph />
          </div>
        </div>
      </section>
    </main>
  );
}

export const metadata = {
  title: "junsan14｜ABOUT",
};