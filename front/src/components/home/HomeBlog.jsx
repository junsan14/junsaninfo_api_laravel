import PostsList from "@/components/posts/PostsList";
import CommonButton from "@/components/common/CommonButton";
import SectionHeading from "@/components/common/SectionHeading";
import { Suspense } from "react";
import { MdOutlineReadMore } from "react-icons/md";
import { useTranslations } from "next-intl";

import styles from "./HomeBlog.module.css";

export default function HomeBlog() {
  const t = useTranslations("Top.HomeBlog");

  return (
    <section className={styles.blog}>
      <div className={styles.inner}>
        <SectionHeading title={t("title")} lead={t("lead")} />

        <div className={styles.posts}>
          <Suspense>
            <PostsList postLimit={4} isTop={true} />
          </Suspense>
        </div>

        <CommonButton.Align position="bottomRight">
          <CommonButton
            href="/blog"
            variant="secondary"
            icon={<MdOutlineReadMore />}
          >
            {t("more")}
          </CommonButton>
        </CommonButton.Align>
      </div>
    </section>
  );
}