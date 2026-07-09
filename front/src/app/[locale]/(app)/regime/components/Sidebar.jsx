import {
  FaCode,
  FaStar,
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
            <li>GA4 / Google Search Console</li>
            <li>Slack</li>
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
              <li  key={item}>
               
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
            <li>TOEFL iBT 80点(2014)</li>
            <li>TOEIC 920点(2014)</li>
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
            ルワンダで初めて教職に携わった経験を通じて、教育が人の可能性を広げ、将来の選択肢を増やす力を持つことを実感しました。
          </p>
          <p>
            これまで培ってきたWeb開発・業務改善の実務経験と英語力を活かし、テクノロジーと教育をつなぐ教育事業に関わっていきたいと考えています。
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