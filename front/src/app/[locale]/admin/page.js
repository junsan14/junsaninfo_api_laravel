import Link from "next/link";
import { Suspense } from "react";

import PostsList from "@/components/posts/PostsList";

import styles from "./Admin.module.css";

export default function AdminTop() {
  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Dashboard</p>

          <h1 className={styles.heading}>
            <span className={styles.title}>ADMIN TOP</span>
          </h1>
        </div>

        <div className={styles.actions}>
          <Link href="/admin/blog/post/create" className={styles.createLink}>
            New Post
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <Suspense fallback={null}>
          <PostsList
            postLimit={20}
            pagination={true}
            edit={true}
            all={true}
            searchBar={true}
          />
        </Suspense>
      </div>
    </section>
  );
}