import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { FaHouse, FaMeteor } from "react-icons/fa6"
import ParticlesProvider from "@/components/common/background/ParticlesProvider"
import StarryBackground from "@/components/common/background/StarryBackground"
import styles from "./not-found.module.css"

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound")

  return (
    <>
      <ParticlesProvider>
        <StarryBackground />
      </ParticlesProvider>

      <main className={styles.notFound}>
        <section className={styles.panel}>
          <div className={styles.badge}>
            <FaMeteor />
            <span>{t("badge")}</span>
          </div>

          <p className={styles.code}>404</p>

          <h1 className={styles.title}>
            {t("titleLine1")}
            <span>{t("titleLine2")}</span>
          </h1>

          <p className={styles.lead}>{t("lead")}</p>

          <div className={styles.actions}>
            <Link href="/" className={styles.primaryButton}>
              <FaHouse />
              {t("backHome")}
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}