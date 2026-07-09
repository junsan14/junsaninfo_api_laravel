"use client";

import Link from "next/link";
import { MdAccessTime, MdUpdate } from "react-icons/md";

import SectionHeading from "@/components/common/SectionHeading";
import { usePost } from "@/hooks/usePost";

import ConvertCKEditorImageToNextImage from "./ConvertCKEditorImageToNextImage";
import CodeEnhancer from "./stylePost/CodeEnhancer";
import Toc from "./stylePost/TableOfContetsForPost";
import PostsList from "./PostsList";
import { formatDate } from "./Script";

import styles from "./PostContent.module.css";

export default function PostContent({
  category,
  postId,
  slug,
  initialPost,
  is_preview,
}) {
  const { post, error, isLoading, relevantPosts = [] } = usePost(
    category,
    postId,
    slug,
    initialPost,
    is_preview
  );

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.inner}>
          <p className={styles.message}>記事の読み込みに失敗しました。</p>
        </div>
      </section>
    );
  }

  if (isLoading && !post) {
    return <PostSkeleton />;
  }

  if (!post) {
    return (
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.article}>
            <p className={styles.message}>該当IDの記事は存在しません。</p>
          </div>
        </div>
      </section>
    );
  }

  const tags = normalizeTags(post.tags);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.blogHeading}>
          <SectionHeading title={post.title} />
        </div>

        <article className={styles.article} id={post.id}>
          <PostDate post={post} />

          <div className={`${styles.content} ck ck-content`}>
            <Toc />
            <CodeEnhancer />
            {post.content && (
              <ConvertCKEditorImageToNextImage imagePath={post.content} />
            )}
          </div>

          {tags.length > 0 && (
            <TagList tags={tags} />
          )}
        </article>

        {relevantPosts.length > 0 && (
          <aside className={styles.related}>
            <div className={styles.relatedHead}>
              <p className={styles.relatedLabel}>Related Posts</p>
              <h2>関連記事</h2>
            </div>

            <PostsList
              relevantPosts={relevantPosts}
              postLimit={4}
              pagination={false}
              searchBar={false}
            />
          </aside>
        )}
      </div>
    </section>
  );
}

function PostDate({ post }) {
  const publishedAt = formatDate(post.published_at);
  const updatedAt = formatDate(post.updated_at);
  const createdAt = formatDate(post.created_at);

  const isUnpublished = publishedAt === "1970/01/01";
  const isUpdated = publishedAt !== updatedAt;

  if (isUnpublished) {
    return (
      <div className={styles.dateGroup}>
        <DateItem icon={<MdAccessTime />} label="投稿日" value={createdAt} />
      </div>
    );
  }

  if (isUpdated) {
    return (
      <div className={styles.dateGroup}>
        <DateItem icon={<MdUpdate />} label="更新日" value={updatedAt} />
        <DateItem icon={<MdAccessTime />} label="投稿日" value={publishedAt} />
      </div>
    );
  }

  return (
    <div className={styles.dateGroup}>
      <DateItem icon={<MdAccessTime />} label="投稿日" value={publishedAt} />
    </div>
  );
}

function DateItem({ icon, label, value }) {
  return (
    <div className={styles.dateItem}>
      <span className={styles.dateIcon}>{icon}</span>
      <span className={styles.dateLabel}>{label}</span>
      <time className={styles.dateValue}>{value}</time>
    </div>
  );
}

function TagList({ tags }) {
  return (
    <div className={styles.tags}>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?keywords=${encodeURIComponent(tag)}`}
          className={styles.tag}
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}

function PostSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.skeletonHeading}>
          <span />
          <span />
        </div>

        <div className={`${styles.article} ${styles.skeleton}`}>
          <span className={styles.skeletonLine} />
          <span className={styles.skeletonLine} />
          <span className={styles.skeletonLine} />
          <span className={styles.skeletonLineShort} />
          <span className={styles.skeletonBlock} />
        </div>
      </div>
    </section>
  );
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];

  return tags
    .map((tag) => String(tag).trim())
    .filter(Boolean);
}