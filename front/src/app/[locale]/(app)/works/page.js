import { getTranslations } from "next-intl/server";

import SectionHeading from "@/components/common/SectionHeading";
import WorksClient from "./WorksClient";
import styles from "./Works.module.css";

export default async function WorksPage() {
  const t = await getTranslations("Works");

  return (
    <main className={styles.page}>
      <section className={styles.works}>
        <div className="inner">
          <SectionHeading title={t("title")} lead={t("lead")} />
          <WorksClient />
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata() {
  const t = await getTranslations("Works.meta");

  return {
    title: t("title"),
    description: t("description"),
  };
}