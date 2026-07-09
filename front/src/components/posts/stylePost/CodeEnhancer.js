"use client";

import { useEffect } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import scss from "highlight.js/lib/languages/scss";
import php from "highlight.js/lib/languages/php";
import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";

import "highlight.js/styles/monokai-sublime.css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("jsx", javascript);
hljs.registerLanguage("html", html);
hljs.registerLanguage("xml", html);
hljs.registerLanguage("css", css);
hljs.registerLanguage("scss", scss);
hljs.registerLanguage("php", php);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("shell", bash);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python);

const LANGUAGE_LABELS = {
  javascript: "JavaScript",
  js: "JavaScript",
  jsx: "JSX",
  html: "HTML",
  xml: "HTML",
  css: "CSS",
  scss: "SCSS",
  php: "PHP",
  bash: "Bash",
  shell: "Shell",
  sql: "SQL",
  python: "Python",
  py: "Python",
  text: "Code",
};

const COPY_ICON = `
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="currentColor"
      d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"
    />
  </svg>
`;

const CHECK_ICON = `
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="currentColor"
      d="m9.55 17.3-5.2-5.2 1.4-1.4 3.8 3.8 8.7-8.7 1.4 1.4-10.1 10.1Z"
    />
  </svg>
`;

export default function CodeEnhancer() {
  useEffect(() => {
    const enhanceCodeBlocks = () => {
      document.querySelectorAll(".ck-content pre").forEach((pre) => {
        if (pre.closest(".post-code-shell")) return;
        if (pre.dataset.enhanced === "true") return;

        const code = pre.querySelector("code");
        if (!code) return;

        pre.dataset.enhanced = "true";

        let language = getLanguage(code);

        if (language === "GoogleAppsScript") {
          language = "javascript";
        }

        const displayLanguage =
          LANGUAGE_LABELS[language] || language.toUpperCase();

        const rawCode = code.innerText || "";
        const lines = rawCode.replace(/\n$/, "").split(/\r\n|\r|\n/);

        const shell = document.createElement("div");
        shell.className = "post-code-shell";

        const languageBadge = document.createElement("div");
        languageBadge.className = "markup-area-language_text";
        languageBadge.textContent = displayLanguage;

        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.className = "markup-area-copy_text";
        copyButton.innerHTML = COPY_ICON;
        copyButton.setAttribute("aria-label", "コードをコピー");
        copyButton.setAttribute("title", "Copy code");

        const newPre = document.createElement("pre");
        newPre.className = "sub-content";

        const codeWrap = document.createElement("code");
        codeWrap.className = `post-code-lines language-${language}`;

        lines.forEach((line, index) => {
          const row = document.createElement("span");
          row.className = "post-code-line";

          const lineNumber = document.createElement("span");
          lineNumber.className = "post-code-line-number";
          lineNumber.textContent = String(index + 1);

          const lineBody = document.createElement("span");
          lineBody.className = "post-code-line-body";

          if (hljs.getLanguage(language)) {
            lineBody.innerHTML = hljs.highlight(line || " ", {
              language,
            }).value;
          } else {
            lineBody.textContent = line || " ";
          }

          row.appendChild(lineNumber);
          row.appendChild(lineBody);
          codeWrap.appendChild(row);
        });

        newPre.appendChild(codeWrap);

        shell.appendChild(languageBadge);
        shell.appendChild(copyButton);
        shell.appendChild(newPre);

        pre.replaceWith(shell);

        copyButton.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(rawCode);

            copyButton.innerHTML = CHECK_ICON;
            copyButton.classList.add("copied");
            copyButton.setAttribute("title", "Copied");

            setTimeout(() => {
              copyButton.innerHTML = COPY_ICON;
              copyButton.classList.remove("copied");
              copyButton.setAttribute("title", "Copy code");
            }, 1600);
          } catch {
            copyButton.classList.add("failed");

            setTimeout(() => {
              copyButton.classList.remove("failed");
            }, 1600);
          }
        });
      });
    };

    enhanceCodeBlocks();

    const observer = new MutationObserver(() => {
      enhanceCodeBlocks();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}

function getLanguage(code) {
  const className = code.className || "";
  const match = className.match(/language-([a-zA-Z0-9_-]+)/);

  if (match?.[1]) {
    return match[1];
  }

  return "text";
}