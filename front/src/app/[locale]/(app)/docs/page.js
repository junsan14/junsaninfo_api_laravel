"use client";

import { useState } from "react";
import {
  BsFiletypePpt,
  BsFiletypeHtml,
  BsFiletypeCss,
  BsFiletypeJs,
  BsFiletypeJsx,
  BsFiletypePhp,
} from "react-icons/bs";
import { FaChevronRight } from "react-icons/fa6";

import SectionHeading from "@/components/common/SectionHeading";
import styles from "./Docs.module.css";

import htmlData from "./html.json";
import cssData from "./css.json";
import jsData from "./js.json";
import phpData from "./php.json";
import reactData from "./react.json";

const MATERIALS = {
  html: htmlData,
  css: cssData,
  js: jsData,
  php: phpData,
  react: reactData,
};

const CATEGORIES = ["html", "css", "js", "php", "react"];

export default function Docs() {
  const [selectedCategory, setSelectedCategory] = useState("html");

  const sections = MATERIALS[selectedCategory] ?? [];

  const getFileIcon = (format) => {
    if (format === "html") return <BsFiletypeHtml />;
    if (format === "css") return <BsFiletypeCss />;
    if (format === "php") return <BsFiletypePhp />;
    if (format === "js") return <BsFiletypeJs />;
    if (format === "jsx") return <BsFiletypeJsx />;

    return <BsFiletypePpt />;
  };

  const renderSection = (item) => {
    if (Array.isArray(item)) {
      return (
        <ul className={styles.fileList}>
          {item.map((subItem, i) => (
            <li key={i} className={styles.fileItem}>
              {subItem &&
              typeof subItem === "object" &&
              "name" in subItem &&
              "url" in subItem ? (
                <a
                  href={subItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.fileLink}
                >
                  <span className={styles.fileIcon}>
                    {getFileIcon(subItem.format)}
                  </span>

                  <span className={styles.fileName}>{subItem.name}</span>

                  <span className={styles.fileArrow}>
                    <FaChevronRight />
                  </span>
                </a>
              ) : (
                renderSection(subItem)
              )}
            </li>
          ))}
        </ul>
      );
    }

    if (item && typeof item === "object") {
      return Object.entries(item).map(([title, content]) => (
        <div key={title} className={styles.docsSection}>
          <h3 className={styles.docsSectionTitle}>{title}</h3>
          {renderSection(content)}
        </div>
      ));
    }

    return null;
  };

  return (
    <main className={styles.page}>
      <section className={styles.docs}>
        <div className="inner">
          <SectionHeading
            title="DOCUMENTS"
            lead="これまで作成した学習資料をまとめています"
          />

          <ul className={styles.categoryTabs}>
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  className={`${styles.categoryButton} ${
                    selectedCategory === cat ? styles.active : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.docsFiles}>
            {sections.map((sectionObj, idx) => (
              <div key={idx} className={styles.docsSection}>
                {renderSection(sectionObj)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
