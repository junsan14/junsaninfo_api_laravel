import Image from "next/image";
import { useTranslations } from "next-intl";
import { MdArrowOutward } from "react-icons/md";

import CommonButton from "@/components/common/CommonButton";
import SectionHeading from "@/components/common/SectionHeading";
import styles from "./FeaturedWorks.module.css";

export default function FeaturedWorks() {
  const t = useTranslations("Top.FeaturedWorks");
  const works = t.raw("items");

  return (
    <section className={styles.works}>
      <div className={styles.inner}>
        <SectionHeading title={t("title")} lead={t("lead")} />

        <div className={styles.grid}>
          {works.map((work) => (
            <article className={styles.card} key={work.id}>
              <a
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.thumbnail}
                aria-label={t("aria.open", { title: work.title })}
              >
                <Image
                  src={work.image}
                  alt={t("aria.thumbnail", { title: work.title })}
                  width={720}
                  height={420}
                  className={styles.image}
                  unoptimized
                />
              </a>

              <div className={styles.body}>
                <div className={styles.cardHead}>
                  <div>
                    <p className={styles.category}>{work.category}</p>
                    <h3>{work.title}</h3>

                    <div className={styles.tags}>
                      {work.tech.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={work.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconLink}
                    aria-label={t("aria.open", { title: work.title })}
                  >
                    <MdArrowOutward />
                  </a>
                </div>

                <p>{work.description}</p>
              </div>
            </article>
          ))}
        </div>

        <CommonButton.Align position="bottomRight">
          <CommonButton
            href="/works"
            variant="secondary"
            icon={<MdArrowOutward />}
          >
            {t("more")}
          </CommonButton>
        </CommonButton.Align>
      </div>
    </section>
  );
}