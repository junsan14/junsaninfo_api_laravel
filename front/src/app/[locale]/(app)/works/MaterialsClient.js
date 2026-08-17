"use client";

import { useMemo, useState } from "react";
import {
  FaArrowUpRightFromSquare,
  FaCode,
  FaFile,
  FaFolderOpen,
} from "react-icons/fa6";

import htmlData from "./data/html.json";
import cssData from "./data/css.json";
import jsData from "./data/js.json";
import phpData from "./data/php.json";
import reactData from "./data/react.json";
import styles from "./Materials.module.css";

const categories = [
  {
    key: "html",
    label: "HTML",
    shortLabel: "HTML",
    description: "Web basics, page structure and HTML elements",
    data: htmlData,
  },
  {
    key: "css",
    label: "CSS",
    shortLabel: "CSS",
    description: "Styling, layout, responsive design and animation",
    data: cssData,
  },
  {
    key: "javascript",
    label: "JavaScript",
    shortLabel: "JS",
    description: "JavaScript fundamentals, DOM and practical projects",
    data: jsData,
  },
  {
    key: "php",
    label: "PHP / Laravel",
    shortLabel: "PHP",
    description: "PHP fundamentals, databases, CMS and Laravel",
    data: phpData,
  },
  {
    key: "react",
    label: "React / Next.js",
    shortLabel: "React",
    description: "React, hooks, TypeScript basics and Next.js",
    data: reactData,
  },
];

const isMaterial = (value) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  typeof value.name === "string" &&
  typeof value.url === "string";

const countMaterials = (value) => {
  if (Array.isArray(value)) {
    return value.reduce((total, item) => total + countMaterials(item), 0);
  }

  if (!value || typeof value !== "object") return 0;
  if (isMaterial(value)) return 1;

  return Object.values(value).reduce(
    (total, item) => total + countMaterials(item),
    0
  );
};

const getMaterialType = (material) => {
  if (material.format) return material.format.toUpperCase();
  return "SLIDES";
};

function MaterialLink({ material }) {
  const isCodeFile = Boolean(material.format);

  return (
    <a
      href={material.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.materialLink}
    >
      <span className={styles.materialIcon} aria-hidden="true">
        {isCodeFile ? <FaCode /> : <FaFile />}
      </span>

      <span className={styles.materialText}>
        <strong>{material.name.trim()}</strong>
        <span>{getMaterialType(material)}</span>
      </span>

      <span className={styles.previewAction}>
        {isCodeFile ? "Open" : "Preview"}
        <FaArrowUpRightFromSquare />
      </span>
    </a>
  );
}

function MaterialTree({ value, path = "root", depth = 0 }) {
  if (Array.isArray(value)) {
    return (
      <div className={depth === 0 ? styles.sectionList : styles.nestedList}>
        {value.map((item, index) => (
          <MaterialTree
            key={`${path}-${index}`}
            value={item}
            path={`${path}-${index}`}
            depth={depth}
          />
        ))}
      </div>
    );
  }

  if (isMaterial(value)) {
    return <MaterialLink material={value} />;
  }

  if (!value || typeof value !== "object") return null;

  return Object.entries(value).map(([title, children], index) => {
    const amount = countMaterials(children);
    const isTopLevel = depth === 0;

    return (
      <details
        className={`${styles.section} ${
          isTopLevel ? styles.topLevelSection : styles.nestedSection
        }`}
        key={`${path}-${title}-${index}`}
        open={isTopLevel && index === 0}
      >
        <summary className={styles.sectionSummary}>
          <span className={styles.sectionTitleWrap}>
            <span className={styles.folderIcon} aria-hidden="true">
              <FaFolderOpen />
            </span>
            <span className={styles.sectionTitle}>{title}</span>
          </span>

          <span className={styles.sectionMeta}>
            {amount} {amount === 1 ? "material" : "materials"}
          </span>
        </summary>

        <div className={styles.sectionContent}>
          <MaterialTree
            value={children}
            path={`${path}-${title}`}
            depth={depth + 1}
          />
        </div>
      </details>
    );
  });
}

export default function MaterialsClient() {
  const [activeKey, setActiveKey] = useState(categories[0].key);

  const activeCategory = useMemo(
    () => categories.find((category) => category.key === activeKey) || categories[0],
    [activeKey]
  );

  const totalCount = useMemo(
    () => categories.reduce((total, category) => total + countMaterials(category.data), 0),
    []
  );

  return (
    <div className={styles.materialsBody}>
      <div className={styles.overview}>
        <div>
          <p className={styles.eyebrow}>COURSE LIBRARY</p>
          <p className={styles.overviewText}>
            Select a category and open a lesson to preview the teaching material.
          </p>
        </div>

        <div className={styles.totalCount}>
          <strong>{totalCount}</strong>
          <span>materials</span>
        </div>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Material categories">
        {categories.map((category) => {
          const active = category.key === activeCategory.key;
          const count = countMaterials(category.data);

          return (
            <button
              key={category.key}
              type="button"
              role="tab"
              aria-selected={active}
              className={`${styles.tab} ${active ? styles.activeTab : ""}`}
              onClick={() => setActiveKey(category.key)}
            >
              <span className={styles.tabName}>
                <span className={styles.desktopLabel}>{category.label}</span>
                <span className={styles.mobileLabel}>{category.shortLabel}</span>
              </span>
              <span className={styles.tabCount}>{count}</span>
            </button>
          );
        })}
      </div>

      <section className={styles.categoryPanel} key={activeCategory.key}>
        <header className={styles.categoryHeader}>
          <div>
            <p className={styles.categoryKicker}>SELECTED COURSE</p>
            <h2>{activeCategory.label}</h2>
            <p>{activeCategory.description}</p>
          </div>

          <span className={styles.categoryCount}>
            {countMaterials(activeCategory.data)} materials
          </span>
        </header>

        <MaterialTree value={activeCategory.data} path={activeCategory.key} />
      </section>

      <p className={styles.note}>
        Slide links open in a new tab. Dropbox preview links can be used directly in each JSON file.
      </p>
    </div>
  );
}
