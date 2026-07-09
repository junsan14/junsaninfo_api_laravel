"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Radar,
  RadarChart,
  PolarGrid,
  Tooltip,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

import {
  FaStar,
  FaRegStar,
  FaStarHalfStroke,
  FaHandPointer,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa6";

import styles from "./SkillGraph.module.css";

const skillGroups = {
  front: {
    labelKey: "skills.groups.front.label",
    descKeys: ["skills.groups.front.desc.0", "skills.groups.front.desc.1"],
    data: [
      { key: "htmlCss", A: 4.5, fullMark: 5 },
      { key: "javascript", A: 4.5, fullMark: 5 },
      { key: "react", A: 4, fullMark: 5 },
      { key: "nextjs", A: 4, fullMark: 5 },
      { key: "i18n", A: 3.5, fullMark: 5 },
      { key: "uiDesign", A: 3.5, fullMark: 5 },
    ],
  },

  back: {
    labelKey: "skills.groups.back.label",
    descKeys: ["skills.groups.back.desc.0", "skills.groups.back.desc.1"],
    data: [
      { key: "php", A: 3.5, fullMark: 5 },
      { key: "laravel", A: 4, fullMark: 5 },
      { key: "mysql", A: 3.5, fullMark: 5 },
      { key: "restApi", A: 3.5, fullMark: 5 },
      { key: "auth", A: 3, fullMark: 5 },
      { key: "wordpress", A: 3, fullMark: 5 },
    ],
  },

  tools: {
    labelKey: "skills.groups.tools.label",
    descKeys: ["skills.groups.tools.desc.0", "skills.groups.tools.desc.1"],
    data: [
      { key: "gitGithub", A: 4, fullMark: 5 },
      { key: "vercel", A: 3.5, fullMark: 5 },
      { key: "linuxServer", A: 3, fullMark: 5 },
      { key: "googleWorkspace", A: 4.5, fullMark: 5 },
      { key: "cicd", A: 3, fullMark: 5 },
      { key: "figmaXd", A: 3.5, fullMark: 5 },
    ],
  },

  education: {
    labelKey: "skills.groups.education.label",
    descKeys: [
      "skills.groups.education.desc.0",
      "skills.groups.education.desc.1",
    ],
    data: [
      { key: "teaching", A: 4.5, fullMark: 5 },
      { key: "curriculum", A: 4, fullMark: 5 },
      { key: "direction", A: 4, fullMark: 5 },
      { key: "documentation", A: 4, fullMark: 5 },
      { key: "problemSolving", A: 4, fullMark: 5 },
      { key: "english", A: 3.5, fullMark: 5 },
    ],
  },
};

const groupKeys = Object.keys(skillGroups);

export function SkillGraph() {
  const t = useTranslations("About");

  const [activeKey, setActiveKey] = useState("front");
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);

  const activeGroup = skillGroups[activeKey];

  const activeIndex = groupKeys.indexOf(activeKey);

  const chartColors = useMemo(
    () => ({
      text: "var(--color-text-soft)",
      muted: "var(--color-text-muted)",
      grid: "var(--color-border-strong)",
      stroke: "var(--color-primary)",
      fill: "var(--color-primary)",
    }),
    []
  );

  const chartData = activeGroup.data.map((skill) => ({
    ...skill,
    subject: t(`skills.items.${skill.key}.label`),
    note: t(`skills.items.${skill.key}.note`),
  }));

  const changeCategoryByIndex = (nextIndex) => {
    const fixedIndex =
      (nextIndex + groupKeys.length) % groupKeys.length;

    setActiveKey(groupKeys[fixedIndex]);
  };

  const handleTouchStart = (e) => {
    if (!isMobile) return;

    const touch = e.touches[0];

    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || touchStartX === null || touchStartY === null) return;

    const touch = e.changedTouches[0];

    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;

    const isHorizontalSwipe = Math.abs(diffX) > 54 && Math.abs(diffX) > Math.abs(diffY) * 1.4;

    if (isHorizontalSwipe) {
      if (diffX < 0) {
        changeCategoryByIndex(activeIndex + 1);
      } else {
        changeCategoryByIndex(activeIndex - 1);
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className={styles.skill}>
      <div className={styles.tabs} role="tablist" aria-label="Skill categories">
        {Object.entries(skillGroups).map(([key, group]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeKey === key}
            className={activeKey === key ? styles.activeTab : ""}
            onClick={() => setActiveKey(key)}
          >
            {t(group.labelKey)}
          </button>
        ))}
      </div>

      <div className={styles.swipeHint} aria-hidden="true">
        <FaArrowLeft />
        <FaHandPointer />
        <FaArrowRight />
      </div>

      <div
        className={styles.content}
        key={activeKey}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.graphCard}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              outerRadius={isMobile ? "65%" : "74%"}
              data={chartData}
              margin={
                isMobile
                  ? { top: 28, right: 34, bottom: 28, left: 34 }
                  : { top: 12, right: 16, bottom: 12, left: 16 }
              }
            >
              <PolarGrid stroke={chartColors.grid} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fill: chartColors.text,
                  fontSize: isMobile ? 10 : 11,
                  fontWeight: 700,
                }}
              />
              <PolarRadiusAxis
                domain={[0, 5]}
                tick={{
                  fill: chartColors.muted,
                  fontSize: 10,
                }}
                axisLine={false}
                tickCount={6}
              />
              <Tooltip content={<CustomTooltip />} />
              <Radar
                name="Skill"
                dataKey="A"
                stroke={chartColors.stroke}
                fill={chartColors.fill}
                fillOpacity={0.28}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.descCard}>
          <div className={styles.scoreList}>
            {chartData.map((skill) => (
              <div className={styles.scoreItem} key={skill.key}>
                <div className={styles.scoreHead}>
                  <span>{skill.subject}</span>

                  <div
                    className={styles.starRating}
                    aria-label={`${skill.subject}: ${skill.A} / 5`}
                  >
                    <Stars value={skill.A} />
                  </div>
                </div>

                <p className={styles.skillNote}>{skill.note}</p>
              </div>
            ))}
          </div>

          <div className={styles.descText}>
            {activeGroup.descKeys.map((key) => (
              <p key={key}>{t(key)}</p>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.dots} aria-hidden="true">
        {groupKeys.map((key) => (
          <span
            key={key}
            className={activeKey === key ? styles.activeDot : ""}
          />
        ))}
      </div>
    </div>
  );
}

function Stars({ value, max = 5 }) {
  return (
    <span className={styles.stars}>
      {Array.from({ length: max }).map((_, index) => {
        const current = index + 1;

        if (value >= current) {
          return <FaStar key={current} />;
        }

        if (value >= current - 0.5) {
          return <FaStarHalfStroke key={current} />;
        }

        return <FaRegStar key={current} />;
      })}
    </span>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;

  return (
    <div className={styles.tooltip}>
      <strong>{label}</strong>
      <p>{item?.note || label}</p>
    </div>
  );
}