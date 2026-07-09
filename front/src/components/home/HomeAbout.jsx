import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiHtml5,
  SiCss3,
  SiPhp,
  SiLaravel,
  SiMysql,
  SiGithub,
  SiVercel,
  SiGoogle,
  SiFigma,
  SiAdobephotoshop,
  SiAdobexd,
} from "react-icons/si";
import { MdArrowOutward, MdApi } from "react-icons/md";
import { useTranslations } from "next-intl";

import CommonButton from "@/components/common/CommonButton";
import SectionHeading from "@/components/common/SectionHeading";
import styles from "./HomeAbout.module.css";

const skillIcons = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  React: SiReact,
  "Next.js": SiNextdotjs,
  HTML: SiHtml5,
  CSS: SiCss3,
  PHP: SiPhp,
  Laravel: SiLaravel,
  MySQL: SiMysql,
  "REST API": MdApi,
  Figma: SiFigma,
  "Adobe XD": SiAdobexd,
  Photoshop: SiAdobephotoshop,
  GitHub: SiGithub,
  Vercel: SiVercel,
  "Google Apps": SiGoogle,
};

export default function HomeAbout() {
  const t = useTranslations("Top.HomeAbout");
  const skillCategories = t.raw("skillCategories");

  return (
    <section className={styles.about}>
      <div className={styles.inner}>
        <SectionHeading title={t("title")} lead={t("lead")} />

        <div className={styles.skillGrid}>
          {skillCategories.map((category) => (
            <section className={styles.skillGroup} key={category.title}>
              <h3>{category.title}</h3>

              <div className={styles.skillList}>
                {category.skills.map((skill) => {
                  const Icon = skillIcons[skill.iconKey] || SiJavascript;

                  return (
                    <div className={styles.skillItem} key={skill.name}>
                      <Icon />
                      <span>{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <CommonButton.Align position="bottomRight">
          <CommonButton
            href="/about"
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