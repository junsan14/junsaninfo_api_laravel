"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  FaArrowUpRightFromSquare,
  FaCode,
  FaDatabase,
  FaDesktop,
  FaLayerGroup,
  FaLeftRight,
  FaMobileScreen,
  FaServer,
  FaUserGear,
} from "react-icons/fa6";

import styles from "./Works.module.css";

const techLabels = [
  { key: "frontend", labelKey: "frontend", icon: FaDesktop },
  { key: "backend", labelKey: "backend", icon: FaServer },
  { key: "database", labelKey: "database", icon: FaDatabase },
  { key: "infrastructure", labelKey: "infrastructure", icon: FaUserGear },
];

const SWIPE_THRESHOLD = 50;

const formatStatusTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(new Date())
    .replace(/^0/, "");

const formatPreviewUrl = (url) => {
  if (!url) return "internal.local";

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    const pathname =
      parsedUrl.pathname === "/" ? "" : parsedUrl.pathname.replace(/\/$/, "");

    return `${hostname}${pathname}`;
  } catch {
    return url
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "");
  }
};

export default function WorksClient() {
  const t = useTranslations("Works");
  const works = t.raw("items");

  const [activeId, setActiveId] = useState(works[0].id);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [slideDirection, setSlideDirection] = useState("");
  const [statusTime, setStatusTime] = useState("9:41");

  const activeIndex = useMemo(
    () => works.findIndex((work) => work.id === activeId),
    [activeId, works]
  );

  const activeWork = works[activeIndex] || works[0];

  const previewUrl = useMemo(
    () => formatPreviewUrl(activeWork.url),
    [activeWork.url]
  );

  useEffect(() => {
    const updateStatusTime = () => {
      setStatusTime(formatStatusTime());
    };

    updateStatusTime();

    const timerId = window.setInterval(updateStatusTime, 30_000);

    return () => window.clearInterval(timerId);
  }, []);

  const changeWork = (nextIndex) => {
    const safeIndex = (nextIndex + works.length) % works.length;
    const nextWork = works[safeIndex];

    setSlideDirection(safeIndex > activeIndex ? "next" : "prev");
    setActiveId(nextWork.id);

    window.setTimeout(() => {
      setSlideDirection("");
    }, 260);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];

    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || touchStartY === null) return;

    const touch = e.changedTouches[0];
    const diffX = touchStartX - touch.clientX;
    const diffY = touchStartY - touch.clientY;

    setTouchStartX(null);
    setTouchStartY(null);

    if (Math.abs(diffY) > Math.abs(diffX)) return;
    if (Math.abs(diffX) < SWIPE_THRESHOLD) return;

    if (diffX > 0) {
      changeWork(activeIndex + 1);
    } else {
      changeWork(activeIndex - 1);
    }
  };

  return (
    <div className={styles.worksBody}>
      <div className={styles.tabs} aria-label={t("aria.navigation")}>
        {works.map((work, index) => (
          <button
            key={work.id}
            type="button"
            className={`${styles.tab} ${
              activeWork.id === work.id ? styles.activeTab : ""
            }`}
            onClick={() => changeWork(index)}
          >
            <span>{work.category}</span>
            {work.title}
          </button>
        ))}
      </div>

      <div className={styles.swipeHint} aria-label={t("aria.swipe")}>
        <FaLeftRight />
      </div>

      <article
        key={activeWork.id}
        className={`${styles.workDetail} ${
          slideDirection === "next" ? styles.slideNext : ""
        } ${slideDirection === "prev" ? styles.slidePrev : ""}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.visualArea}>
          <div className={styles.visualStage}>
            <div className={styles.pcDevice}>
              <div className={styles.pcPreview}>
                <div className={styles.previewHeader}>
                  <span />
                  <span />
                  <span />
                </div>

                <div className={styles.pcImageWrap}>
                  <Image
                    src={activeWork.pcImage}
                    alt={t("imageAlt.pc", {
                      title: activeWork.title,
                    })}
                    fill
                    sizes="(max-width: 767px) 100vw, 720px"
                    className={styles.previewImage}
                    priority
                  />
                </div>

                <p className={styles.previewLabel}>
                  <FaDesktop />
                  {t("labels.pcTop")}
                </p>
              </div>

              <div className={styles.pcStand}>
                <span className={styles.pcStandNeck} />
                <span className={styles.pcStandBase} />
              </div>
            </div>

            <div className={styles.spPreview}>
              <div className={styles.spScreen}>
                <div className={styles.spStatusBar}>
                  <time className={styles.spTime}>{statusTime}</time>

                  <span
                    className={styles.dynamicIsland}
                    aria-hidden="true"
                  >
                    <span className={styles.dynamicIslandCamera} />
                  </span>

                  <div
                    className={styles.spStatusIcons}
                    aria-hidden="true"
                  >
                    <span className={styles.cellularSignal}>
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>

                    <span className={styles.Signal}>
                     LTE
                    </span>

                    <span className={styles.batteryIcon}>
                      <span />
                    </span>
                  </div>
                </div>

                <div className={styles.spBrowserBar}>
                  <div className={styles.spAddressBar}>
                    <span className={styles.addressText}>
                      {previewUrl}
                    </span>
                  </div>
                </div>

                <div className={styles.spImageWrap}>
                  <Image
                    src={activeWork.spImage}
                    alt={t("imageAlt.sp", {
                      title: activeWork.title,
                    })}
                    fill
                    sizes="160px"
                    className={styles.previewImage}
                    unoptimized
                  />

                  <span
                    className={styles.spHomeIndicator}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <p className={styles.spPreviewLabel}>
                <FaMobileScreen />
                {t("labels.spTop")}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.contentArea}>
          <div className={styles.titleBlock}>
            <p className={styles.category}>
              {activeWork.category}
            </p>

            <h2>{activeWork.title}</h2>

            <p className={styles.summary}>
              {activeWork.summary}
            </p>
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span>{t("labels.published")}</span>
              <strong>{activeWork.publishedAt}</strong>
            </div>

            <div className={styles.metaItem}>
              <span>{t("labels.period")}</span>
              <strong>{activeWork.period}</strong>
            </div>
          </div>

          <div className={styles.sectionBlock}>
            <h3>
              <FaLayerGroup />
              {t("labels.roles")}
            </h3>

            <div className={styles.roleList}>
              {activeWork.roles.map((role) => (
                <span key={role}>{role}</span>
              ))}
            </div>
          </div>

          <div className={styles.sectionBlock}>
            <h3>
              <FaCode />
              {t("labels.tech")}
            </h3>

            <div className={styles.techGrid}>
              {techLabels.map((tech) => {
                const Icon = tech.icon;
                const items = activeWork.tech[tech.key] || [];

                return (
                  <div
                    className={styles.techCard}
                    key={tech.key}
                  >
                    <h4>
                      <Icon />
                      {t(`techLabels.${tech.labelKey}`)}
                    </h4>

                    <div className={styles.techList}>
                      {items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.sectionBlock}>
            <h3>{t("labels.prPoint")}</h3>

            <ul className={styles.pointList}>
              {activeWork.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <p className={styles.prText}>
            {activeWork.pr}
          </p>

          {activeWork.url ? (
            <a
              href={activeWork.url}
              target="_blank"
              rel="noreferrer"
              className={styles.visitButton}
            >
              {t("labels.viewSite")}
              <FaArrowUpRightFromSquare />
            </a>
          ) : (
            <span className={styles.noLink}>
              {t("labels.noLink")}
            </span>
          )}
        </div>
      </article>
    </div>
  );
}