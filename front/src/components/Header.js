"use client";

import Image from "next/image";
import {
  FaInstagram,
  FaThreads,
  FaMoon,
  FaSun,
} from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/auth";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import styles from "./Header.module.css";

export default function Header() {
  const { user, logout } = useAuth();

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [isShowMenu, setIsShowMenu] = useState(false);
  const [theme, setTheme] = useState("dark");

  const isDark = theme === "dark";

  const toggleMenu = () => {
    setIsShowMenu((prev) => !prev);
  };

  const closeMenu = () => {
    setIsShowMenu(false);
  };

  const toggleLocale = () => {
    const nextLocale = locale === "ja" ? "en" : "ja";

    if (!routing.locales.includes(nextLocale)) return;

    router.push(pathname, { locale: nextLocale });
    closeMenu();
  };

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  };

 useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    setTheme(savedTheme);
    document.documentElement.dataset.theme = savedTheme;
    return;
  }
  //new commit
  // 保存がなければブラウザ設定に任せる
  document.documentElement.removeAttribute("data-theme");

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}, []);

  useEffect(() => {
    if (!isShowMenu) {
      document.body.classList.remove("noscroll");
      return;
    }

    document.body.classList.add("noscroll");

    return () => {
      document.body.classList.remove("noscroll");
    };
  }, [isShowMenu]);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoImageWrap}>
            <Image
              src="/profile.png"
              alt="junsan14"
              width={36}
              height={36}
              className={styles.logoImage}
              priority
            />
          </span>
          <span className={styles.logoText}>junsan14</span>
        </Link>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.themeMiniButton}
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>

          <button
            type="button"
            className={`${styles.toggle} ${isShowMenu ? styles.show : ""}`}
            onClick={toggleMenu}
            aria-label={isShowMenu ? "Close menu" : "Open menu"}
            aria-expanded={isShowMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav className={`${styles.nav} ${isShowMenu ? styles.show : ""}`}>
          <div className={styles.navPanel}>
            <ul className={styles.navList}>
              <li>
                <Link href="/" onClick={closeMenu}>
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={closeMenu}>
                  ABOUT
                </Link>
              </li>
              <li>
                <Link href="/blog" onClick={closeMenu}>
                  NOTES
                </Link>
              </li>
              <li>
                <Link href="/works" onClick={closeMenu}>
                  WORKS
                </Link>
              </li>
              <li>
                <Link href="/docs" onClick={closeMenu}>
                  DOCS
                </Link>
              </li>

              {user && (
                <>
                  <li>
                    <Link href="/admin" onClick={closeMenu}>
                      ADMIN
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={styles.logoutButton}
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                    >
                      LOGOUT
                    </button>
                  </li>
                </>
              )}
            </ul>

            <div className={styles.navBottom}>
              <div className={styles.snsList}>
                <a
                  href="https://www.threads.net/@junsan_junsan14/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Threads"
                >
                  <FaThreads />
                </a>
                <a
                  href="https://www.instagram.com/junsan_junsan14"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
              </div>

              <div className={styles.menuControls}>
                <button
                  type="button"
                  className={styles.langToggle}
                  onClick={toggleLocale}
                  aria-label={
                    locale === "ja" ? "Switch to English" : "日本語に切り替え"
                  }
                >
                  <span
                    className={`${styles.toggleOption} ${
                      locale === "ja" ? styles.active : ""
                    }`}
                  >
                    JP
                  </span>

                  <span
                    className={`${styles.toggleOption} ${
                      locale === "en" ? styles.active : ""
                    }`}
                  >
                    EN
                  </span>
                </button>

                <button
                  type="button"
                  className={styles.themeToggle}
                  onClick={toggleTheme}
                  aria-label={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  <span
                    className={`${styles.toggleOption} ${
                      isDark ? styles.active : ""
                    }`}
                  >
                    <FaMoon />
                  </span>

                  <span
                    className={`${styles.toggleOption} ${
                      !isDark ? styles.active : ""
                    }`}
                  >
                    <FaSun />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}