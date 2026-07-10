"use client";

import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { useState, useEffect } from "react";
import { get, set, del } from "idb-keyval";
import { useRouter } from "next/navigation";
import Script from "next/script";
import dynamic from "next/dynamic";
import NProgress from "nprogress";
import CreatableSelect from "react-select/creatable";

import CKFinderLoader from "@/components/posts/CKFinderLoader";
import { formatinputDate } from "@/components/posts/Script";
import { useAuth } from "@/hooks/auth";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import { useBlogSubCategories } from "@/hooks/useBlogSubCategories";
import { useBlogTags } from "@/hooks/useBlogTags";

import styles from "./BlogEditor.module.css";

const ClientSideCustomEditor = dynamic(
  () => import("@/components/posts/CustomEditor"),
  { ssr: false }
);

const sendData = async (url, { arg }) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    throw new Error("送信に失敗しました");
  }

  return res.json();
};

export default function BlogEditor({ postData }) {
  const { user } = useAuth();
  const { blogCategories } = useBlogCategories();
  const { blogSubCategories } = useBlogSubCategories();
  const { blogTags } = useBlogTags();

  const { trigger, data } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/blog/post/store`,
    sendData
  );

  const router = useRouter();
  const { post, isNew, keywords } = postData;

  const [form, setForm] = useState({
    id: isNew ? "" : post.id,
    author_id: user.user.id,
    title: isNew ? "" : post.title,
    content: isNew ? "" : post.content,
    excerpt: isNew ? "" : post.excerpt,
    category: isNew ? 3 : post.category,
    sub_category: isNew ? "" : post.sub_category,
    tags: isNew ? [] : post.tags,
    keywords: isNew ? keywords.keywords : post.keywords,
    slug: isNew ? "" : post.slug,
    thumbnail: isNew ? "" : post.thumbnail,
    is_show: isNew ? 1 : post.is_show,
    is_top: isNew ? 0 : post.is_top,
    is_featured: isNew ? 0 : post.is_featured,
    published_at: isNew ? formatinputDate(new Date()) : post.published_at,
    is_update: 1,
    is_continue: isNew ? 1 : post.is_continue,
    is_restore: "false",
  });

  const draftKey = isNew ? "draft-post-new" : `draft-post-${form.id}`;

  useEffect(() => {
    get(draftKey).then((saved) => {
      if (saved) {
        setForm(saved);
        console.log("Draft restored:", draftKey);
      }
    });
  }, [draftKey]);

  useEffect(() => {
    const saveDraft = setTimeout(() => {
      set(draftKey, form);
      console.log("Draft saved:", draftKey);
    }, 1000);

    return () => clearTimeout(saveDraft);
  }, [draftKey, form]);

  const handleChangeData = (event) => {
    const key = event.target.id;
    const value = event.target.value;

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (event, showValue) => {
    event.preventDefault();
    NProgress.start();

    const submitData = {
      ...form,
      is_show: showValue,
    };

    setForm(submitData);

    try {
      await trigger(submitData);
      console.log("投稿成功:", data);

      await del(draftKey);
      await mutate(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/posts`);

      router.back();
    } catch (err) {
      console.error(err);
    } finally {
      NProgress.done();
    }
  };

  if (!blogCategories || !blogSubCategories || !blogTags) {
    return <p className={styles.loading}>Loading Category && Sub Category && Tags...</p>;
  }

  const tagOptions = blogTags?.map((tag) => ({
    label: tag,
    value: tag,
  }));

  return (
    <>
      <Script
        src="/ckfinder/ckfinder.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("CKFinder script loaded");
        }}
      />

      <CKFinderLoader />

      <form
        onSubmit={(event) => handleSubmit(event, form.is_show)}
        method="post"
        id="form"
        className={styles.form}
        encType="multipart/form-data"
      >
        <div className={styles.main}>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>
              Title
            </label>

            <input
              type="text"
              id="title"
              className={styles.input}
              value={form.title}
              onChange={handleChangeData}
              maxLength={30}
            />
          </div>

          <div className={`${styles.field} ${styles.contentField}`}>
            <label htmlFor="content" className={styles.label}>
              Content
            </label>

            <div className={styles.editor} id="content">
              <ClientSideCustomEditor form={form} setForm={setForm} />
            </div>
          </div>
        </div>

        <aside className={styles.sub}>
          <div className={styles.checkGroup}>
            <label htmlFor="is_top" className={styles.checkLabel}>
              <input
                type="checkbox"
                name="is_top"
                checked={Boolean(form.is_top)}
                id="is_top"
                onChange={(event) => {
                  setForm({
                    ...form,
                    is_top: event.target.checked,
                  });
                }}
                className={styles.checkbox}
              />

              <span>Show on Home</span>
            </label>
          </div>

          <div className={styles.checkGroup}>
            <label htmlFor="is_featured" className={styles.checkLabel}>
              <input
                type="checkbox"
                name="is_featured"
                checked={Boolean(form.is_featured)}
                id="is_featured"
                onChange={(event) => {
                  setForm({
                    ...form,
                    is_featured: event.target.checked,
                  });
                }}
                className={styles.checkbox}
              />

              <span>Pin</span>
            </label>
          </div>

          {!isNew && (
            <div className={styles.checkGroup}>
              <label htmlFor="is_update" className={styles.checkLabel}>
                <input
                  type="checkbox"
                  name="is_update"
                  checked={Boolean(form.is_update)}
                  id="is_update"
                  onChange={(event) => {
                    setForm({
                      ...form,
                      is_update: event.target.checked,
                    });
                  }}
                  className={styles.checkbox}
                />

                <span>Update date</span>
              </label>
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="published_at" className={styles.label}>
              Publish Date
            </label>

            <input
              type="datetime-local"
              className={styles.input}
              value={formatinputDate(form.published_at)}
              name="published_at"
              id="published_at"
              onChange={handleChangeData}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="category" className={styles.label}>
              Category
            </label>

            <select
              className={styles.select}
              value={form.category}
              name="category"
              id="category"
              onChange={handleChangeData}
            >
              {blogCategories.map((category, index) => {
                if (!category) return null;

                return (
                  <option value={index + 1} key={`category_${index + 1}`}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="sub_category" className={styles.label}>
              Sub Category
            </label>

            <input
              list="sub_category_list"
              name="sub_category"
              id="sub_category"
              className={styles.input}
              value={form.sub_category ?? ""}
              onChange={handleChangeData}
            />

            <datalist id="sub_category_list">
              {blogSubCategories.map((subCategory, key) => (
                <option value={subCategory.sub_category} key={key} />
              ))}
            </datalist>
          </div>

          <div className={styles.field}>
            <label htmlFor="tags" className={styles.label}>
              Tags
            </label>

            <CreatableSelect
              isMulti
              options={tagOptions}
              value={
                form.tags &&
                form.tags.map((tag) => ({
                  label: tag,
                  value: tag,
                }))
              }
              onChange={(newValue) => {
                const tagValues = newValue.map((tag) => tag.value);
                setForm({
                  ...form,
                  tags: tagValues,
                });
              }}
              placeholder="タグを入力してEnter..."
              noOptionsMessage={() => "入力してEnterで追加"}
              className={styles.reactSelect}
              classNamePrefix="blogEditorSelect"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="keywords" className={styles.label}>
              Keywords
            </label>

            <textarea
              id="keywords"
              name="keywords"
              className={styles.textarea}
              rows="5"
              value={form.keywords ?? ""}
              onChange={handleChangeData}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="slug" className={styles.label}>
              Slug
            </label>

            <textarea
              id="slug"
              name="slug"
              className={styles.textarea}
              required
              rows="1"
              value={form.slug ?? ""}
              onChange={handleChangeData}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="thumbnail" className={styles.label}>
              Thumbnail
            </label>

            <div className={`${styles.editor} ${styles.thumbnailEditor}`}>
              <ClientSideCustomEditor
                form={form}
                setForm={setForm}
                thumbnail={true}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="excerpt" className={styles.label}>
              Excerpt
            </label>

            <textarea
              id="excerpt"
              name="excerpt"
              className={styles.textarea}
              rows="5"
              value={form.excerpt ?? ""}
              onChange={handleChangeData}
              maxLength={40}
            />
          </div>
           <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.submitButton} ${styles.draftButton}`}
              id="is_show"
              value="0"
              onClick={(event) => handleSubmit(event, 0)}
            >
              Draft
            </button>

            <button
              type="button"
              className={styles.submitButton}
              id="is_show"
              value="1"
              onClick={(event) => handleSubmit(event, 1)}
            >
              {isNew ? "Publish" : "Update"}
            </button>
          </div>
        </aside>

       
      </form>
    </>
  );
}