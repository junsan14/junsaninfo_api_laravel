import {
  FaCode,
  FaStar,
  FaCheckCircle,
  FaTools,
  FaLanguage,
  FaAward,
  FaLayerGroup,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <section className={styles.box}>
        <h2 className={styles.boxTitle}>
          <FaCode />
          SKILLS
        </h2>

        <div className={styles.boxBody}>
          <SkillBlock title="言語・フレームワーク" icon={<FaLayerGroup />}>
            <li>HTML / CSS / JavaScript ES6+</li>
            <li>React / Next.js</li>
            <li>PHP / Laravel</li>
            <li>Google Apps Script</li>
            <li>MySQL</li>
          </SkillBlock>

          <SkillBlock title="ツール・環境" icon={<FaTools />}>
            <li>Git / GitHub</li>
            <li>Google Workspace</li>
            <li>Figma</li>
            <li>GA4 / Google Search Console</li>
            <li>Slack / Notion / Trello</li>
          </SkillBlock>

          <SkillBlock title="強み・得意領域" icon={<FaLightbulb />}>
            {[
              "教育・カリキュラム設計",
              "プログラミング指導（英語）",
              "学習体験・教材の設計と改善",
              "業務改善・自動化・RPA化",
              "Web開発",
              "プロジェクト管理・ディレクション",
              "チームコミュニケーション・調整力",
            ].map((item) => (
              <li className={styles.checkItem} key={item}>
                <FaCheckCircle />
                {item}
              </li>
            ))}
          </SkillBlock>

          <SkillBlock title="語学力" icon={<FaLanguage />}>
            <li>日本語：ネイティブ</li>
            <li>英語：ビジネスレベル</li>
            <li>英語での授業・会議・資料作成が可能</li>
          </SkillBlock>

          <SkillBlock title="資格・スコア" icon={<FaAward />}>
            <li>普通自動車免許</li>
            <li>TOEFL iBT 95点</li>
            <li>TOEIC 920点</li>
          </SkillBlock>

          <SkillBlock title="その他" icon={<FaRocket />}>
            <li>課題解決力・自走力・柔軟性</li>
            <li>多様な背景を持つ人々との協働経験</li>
            <li>新しい技術やツールのキャッチアップ力</li>
          </SkillBlock>
        </div>
      </section>

      <section className={styles.mission}>
        <h2 className={styles.boxTitle}>
          <FaStar />
          PERSONAL MISSION
        </h2>

        <div className={styles.missionBody}>
          <p>
            教育は、人の可能性を広げ、人生を変える力があると信じています。
          </p>
          <p>
            テクノロジーと教育を掛け合わせ、すべての学習者が自信を持って未来を切り開ける世界をつくることを目指しています。
          </p>
        </div>
      </section>
    </aside>
  );
}

function SkillBlock({ title, icon, children }) {
  return (
    <section className={styles.skillBlock}>
      <h3>
        {icon}
        {title}
      </h3>
      <ul>{children}</ul>
    </section>
  );
}