"use client";

import { NextParticles } from "@tsparticles/nextjs";
import { useMemo } from "react";
import styles from "./StarryBackground.module.css";

export default function StarryBackground() {
  const options = useMemo(
    () => ({
      fullScreen: {
        enable: false,
      },
      background: {
        color: {
          value: "transparent",
        },
      },
      preset: "stars",
      particles: {
        number: {
          value: 380,
          density: {
            enable: true,
            area: 900,
          },
        },
        color: {
          value: ["#ffffff", "#dbeafe", "#bae6fd"],
        },
        opacity: {
          value: {
            min: 0.22,
            max: 0.75,
          },
          animation: {
            enable: true,
            speed: 0.4,
            sync: false,
          },
        },
        size: {
          value: {
            min: 0.16,
            max: 0.85,
          },
        },
        move: {
          enable: false,
        },
      },
    }),
    []
  );

  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.skyGlow} />

      <NextParticles
        id="starry-particles"
        options={options}
        className={styles.particles}
      />

      <div className={styles.shootingStars}>
        <span className={`${styles.shootingStar} ${styles.shootingStar1}`} />
        <span className={`${styles.shootingStar} ${styles.shootingStar2}`} />
        <span className={`${styles.shootingStar} ${styles.shootingStar3}`} />
      </div>
    </div>
  );
}