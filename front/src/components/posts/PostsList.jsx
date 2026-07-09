"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ja } from "date-fns/locale";
import NProgress from "nprogress";

import { FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineClear, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { MdAccessTime, MdOutlineFiberNew, MdUpdate } from "react-icons/md";
import { TiPin } from "react-icons/ti";

import ConvertCKEditorImageToNextImage from "./ConvertCKEditorImageToNextImage";
import { formatDate } from "./Script";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import { useBlogSubCategories } from "@/hooks/useBlogSubCategories";
import styles from "./PostsList.module.css";

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch posts.");
  }

  return res.json();
};

const toggleVisibility = async (_url, { arg }) => {
  NProgress.start();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/blog/post/visible?postid=${arg.id}&is_show=${arg.is_show}`,
      {
        method: "PUT",
      }
    );

    if (!res.ok) {
      throw new Error("表示状態の変更に失敗しました。");
    }

    return res.json();
  } finally {
    NProgress.done();
  }
};

const deletePost = async (_url, { arg: id }) => {
  NProgress.start();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/blog/post/delete?postid=${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("削除に失敗しました。");
    }

    return res.json();
  } finally {
    NProgress.done();
  }
};

export default function PostsList({
  postLimit = 6,
  pagination = false,
  edit = false,
  relevantPosts,
  searchBar = false,
  isTop = false,
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname.includes("/admin");

  const initialPage = Number(searchParams.get("page") || 1);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [inputKeywords, setInputKeywords] = useState(
    searchParams.get("keywords") || ""
  );

  const { blogCategories } = useBlogCategories();
  const { blogSubCategories } = useBlogSubCategories();

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(postLimit),
      category: selectedCategory,
      keywords: inputKeywords,
      all: String(isAdmin),
      isTop: String(isTop),
    });

    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog?${params.toString()}`;
  }, [currentPage, postLimit, selectedCategory, inputKeywords, isAdmin, isTop]);

  const { data, error, isLoading } = useSWR(apiUrl, fetcher);

  const { trigger: triggerVisibility, isMutating } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/blog/post/visible`,
    toggleVisibility
  );

  const { trigger: triggerDelete } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/blog/post/delete`,
    deletePost
  );

  const posts = relevantPosts || data?.data || [];
  const totalPages = data?.last_page || 1;
  const paginationRange = getPaginationRange(currentPage, totalPages);

  const isReady =
    !isLoading && data?.data && Array.isArray(blogCategories) && Array.isArray(blogSubCategories);

  const updateUrlParams = (updates) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: true,
    });
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1);

    updateUrlParams({
      category: categoryName,
      page: null,
    });
  };

  const handleSearch = (keyword) => {
    const trimmedKeyword = keyword.trim();

    setInputKeywords(trimmedKeyword);
    setCurrentPage(1);

    updateUrlParams({
      keywords: trimmedKeyword,
      page: null,
    });
  };

  const handleResetSearch = () => {
    setSelectedCategory("");
    setInputKeywords("");
    setCurrentPage(1);

    router.replace(pathname, {
      scroll: true,
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    updateUrlParams({
      page,
    });
  };

  const handleClickVisible = async (post) => {
    try {
      await triggerVisibility({
        id: post.id,
        is_show: post.is_show ? 0 : 1,
      });

      mutate(apiUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickDelete = async (id) => {
    const confirmed = window.confirm("本当に削除してよろしいですか?");

    if (!confirmed) return;

    try {
      await triggerDelete(id);
      mutate(apiUrl);
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return <p className={styles.message}>記事の取得に失敗しました。</p>;
  }

  if (!isReady) {
    return <PostsSkeleton count={postLimit} />;
  }

  return (
    <div className={styles.wrap}>
      {searchBar && (
        <div className={styles.controls}>
          <CategoryTabs
            categories={blogCategories}
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
          />

          <SearchBox
            value={inputKeywords}
            subCategories={blogSubCategories}
            hasFilter={Boolean(selectedCategory || inputKeywords)}
            onSearch={handleSearch}
            onReset={handleResetSearch}
          />
        </div>
      )}

      {posts.length > 0 ? (
        <>
          <div className={styles.posts}>
            {posts.map((post) => {
              const category = blogCategories.find(
                (item) => Number(item.id) === Number(post.category)
              );

              const categorySlug = category?.slug || "category";
              const postHref = post.is_show
                ? `/blog/${categorySlug}/${post.id}/${post.slug}`
                : `/blog/${categorySlug}/${post.id}/${post.slug}?preview=true`;

              return (
                <PostCard
                  key={post.id}
                  post={post}
                  href={postHref}
                  edit={edit}
                  isMutating={isMutating}
                  onToggleVisible={handleClickVisible}
                  onDelete={handleClickDelete}
                />
              );
            })}
          </div>

          {pagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginationRange={paginationRange}
              onChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <p className={styles.message}>
          「{selectedCategory || "全て"}」カテゴリーの中で、「{inputKeywords}」に該当する記事は見つかりませんでした。
        </p>
      )}
    </div>
  );
}

function CategoryTabs({ categories, selectedCategory, onChange }) {
  return (
    <ul className={styles.categoryTabs}>
      {categories.map((category) => (
        <li key={category.id}>
          <button
            type="button"
            className={selectedCategory === category.name ? styles.activeTab : ""}
            onClick={() => onChange(category.name)}
          >
            {category.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

function SearchBox({ value, subCategories, hasFilter, onSearch, onReset }) {
  const [keyword, setKeyword] = useState(value);

  return (
    <div className={styles.searchBox}>
      <button
        type="button"
        className={styles.resetButton}
        onClick={onReset}
        aria-label="検索条件をリセット"
      >
        {hasFilter && <AiOutlineClear />}
      </button>

      <BsSearch className={styles.searchIcon} />

      <input
        list="sub_category_list"
        name="sub_category"
        placeholder="Search..."
        value={keyword}
        onChange={(e) => {
          const nextValue = e.target.value;
          setKeyword(nextValue);

          if (subCategories.some((item) => item.sub_category === nextValue)) {
            onSearch(nextValue);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSearch(keyword);
          }
        }}
      />

      <datalist id="sub_category_list">
        {subCategories.map((subCategory) => (
          <option value={subCategory.sub_category} key={subCategory.id || subCategory.sub_category} />
        ))}
      </datalist>
    </div>
  );
}

function PostCard({
  post,
  href,
  edit,
  isMutating,
  onToggleVisible,
  onDelete,
}) {
  return (
    <article className={`${styles.postCard} ${!post.is_show ? styles.hiddenPost : ""}`}>
      {Boolean(post.is_featured) && <TiPin className={styles.featuredIcon} />}
      {isNew(post.published_at) && <MdOutlineFiberNew className={styles.newIcon} />}

      <Link
        href={href}
        className={styles.postLink}
        target={edit ? "_blank" : undefined}
      >
        <div className={styles.thumbnail}>
          <ConvertCKEditorImageToNextImage imagePath={post.thumbnail} />
        </div>

        <div className={styles.postBody}>
          <h3>{post.title}</h3>

          {post.excerpt && <p>{post.excerpt}</p>}

          <PostDate post={post} />
        </div>
      </Link>

      {edit && (
        <div className={styles.manage}>
          <Link href={`/admin/blog/post/edit?postid=${post.id}`} aria-label="記事を編集">
            <FaEdit />
          </Link>

          <button
            type="button"
            disabled={isMutating}
            onClick={() => onToggleVisible(post)}
            aria-label={post.is_show ? "記事を非公開にする" : "記事を公開する"}
          >
            {post.is_show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>

          <button
            type="button"
            disabled={isMutating}
            onClick={() => onDelete(post.id)}
            aria-label="記事を削除"
          >
            <FaTrash />
          </button>

          <span>ID: {post.id}</span>
        </div>
      )}
    </article>
  );
}

function PostDate({ post }) {
  const isUnpublished = formatDate(post.published_at) === "1970/01/01";
  const isUpdated = formatDate(post.published_at) !== formatDate(post.updated_at);

  if (isUnpublished) {
    return (
      <div className={styles.date}>
        <MdAccessTime />
        <span>公開前</span>
      </div>
    );
  }

  if (isUpdated) {
    return (
      <div className={styles.date}>
        <MdUpdate />
        <span>{formatDistanceToNow(post.updated_at, { locale: ja })}前</span>
      </div>
    );
  }

  return (
    <div className={styles.date}>
      <MdAccessTime />
      <span>{formatDistanceToNow(post.published_at, { locale: ja })}前</span>
    </div>
  );
}

function PostsSkeleton({ count }) {
  return (
    <div className={styles.posts}>
      {Array.from({ length: count }).map((_, index) => (
        <div className={`${styles.postCard} ${styles.skeleton}`} key={index}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonBody}>
            <span />
            <span />
            <span />
          </div>
        </div>
      ))}
    </div>
  );
}

function Pagination({ currentPage, totalPages, paginationRange, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        onClick={() => onChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        前へ
      </button>

      {paginationRange.map((item, index) =>
        typeof item === "string" ? (
          <span key={`dots-${index}`}>{item}</span>
        ) : (
          <button
            type="button"
            key={item}
            onClick={() => onChange(item)}
            className={Number(item) === Number(currentPage) ? styles.currentPage : ""}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        次へ
      </button>
    </div>
  );
}

const isNew = (dateStr) => {
  if (!dateStr) return false;

  const published = new Date(dateStr);
  const today = new Date();
  const diffTime = today - published;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays <= 3;
};

function getPaginationRange(currentPage, totalPages, delta = 1) {
  const range = [];
  const page = Number(currentPage);

  if (totalPages <= 1) return [1];

  const left = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  range.push(1);

  if (left > 2) {
    range.push("...");
  }

  for (let i = left; i <= right; i += 1) {
    range.push(i);
  }

  if (right < totalPages - 1) {
    range.push("...");
  }

  range.push(totalPages);

  return range;
}