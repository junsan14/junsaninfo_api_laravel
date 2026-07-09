import Image from "next/image";
import {
  FaUserCircle,
  FaBriefcase,
  FaLaptopCode,
  FaCheckCircle,
  FaGraduationCap,
  FaGlobeAfrica,
  FaChartLine,
} from "react-icons/fa";
import styles from "./MainContent.module.css";

const jobs = [
  {
    date: "2024.09 - 現在",
    title: "JICA海外協力隊（ルワンダ共和国）｜プログラミング教育担当",
    tag: "教育・国際経験",
    text: "ルワンダの高校にて、学生にプログラミングを英語で指導。技術指導だけでなく、学習環境の改善や学習者のモチベーション向上にも注力しています。",
    duties: [
      "JavaScript, React, Nextjs, PHP, Laravelの授業を英語で実施",
      "教材開発・授業運営の設計",
      "実践型プロジェクト学習の指導",
      "限られたインフラ環境での工夫による学習機会の最大化",
    ],
    resultTitle: "指導内容・実績",
    results: [
      "Web開発基礎〜応用を指導",
      "約30〜40名/期を担当",
      "週20時間以上の授業を実施",
      "教材・演習・クイズを複数作成",
      "生徒のコンペティション参加支援",
    ],
  },
  {
    date: "2022.04 - 2024.03",
    title: "ウィルソア株式会社｜Webディレクター兼コーダー",
    tag: "Web制作・ディレクション",
    text: "Webサイト制作のディレクションからコーディングまで一貫して担当。クライアントとの要件定義から公開後の改善提案まで関わりました。",
    duties: [
      "Webサイトの企画立案、要件定義、提案資料作成",
      "予算管理、スケジュール管理、進行管理",
      "Google Workspaceを活用した社内業務改善ツールの開発",
      "クライアントとのコミュニケーション、運用サポート",
    ],
    resultTitle: "主な実績",
    results: [
      "地域創生・飲料・自動車関連など、複数業種のWebサイト制作・公開ディレクションを担当",
      "メールマガジン制作や更新運用など、公開後の継続的な運用業務にも従事",
      "50件以上の見積書を作成し、提案・受注前工程を支援",
      "Google Workspaceを活用した社内業務ツールを自作し、月平均20時間以上の工数削減を実現",
    ],
  },
  {
    date: "2018.04 - 2022.03",
    title: "株式会社星野リゾート｜社内システムエンジニア",
    tag: "社内SE・業務改善",
    text: "ホテル現場業務を経験した後、社内システムエンジニアとして業務改善・システム開発を担当しました。",
    duties: [
      "ダイニング・フロントなどのホテル現場業務を経験し、現場視点で業務課題を把握",
      "Google Apps Scriptを用いた業務自動化・RPA化",
      "Google Workspace上での業務管理システム開発・運用",
      "イントラネットWEBサイト構築・運用",
      "社員向けITリテラシー研修・勉強会の実施",
      "コロナ禍における労働力・リソース管理、シフト作成支援",
    ],
    resultTitle: "主な実績（具体例）",
    results: [
      "業務効率化 75時間/月を実現",
      "シフト作成業務の工数を大幅削減",
      "導入システムは現場スタッフが継続利用",
      "直感的に利用可能な設計に改善",
      "社内のデジタルリテラシー向上に貢献",
    ],
  },
];

const projects = [
  {
    title: "下灘商店",
    image: "/images/works/shimonada-shoten-pc.webp",
    url: "https://www.shimonada-shoten.com/",
    tech: "Next.js / Laravel",
    text: "地域商店の魅力を伝えるWebサイト。商品・店舗情報を見やすく整理し、ブランドイメージ向上を意識して制作。",
  },
  {
    title: "DQX Tool",
    image: "/images/works/dqx-tool.webp",
    url: "https://www.dqx-tool.com/",
    tech: "Next.js / Laravel / MySQL",
    text: "ドラクエ10向けの検索・攻略支援ツール。モンスター、アクセサリ、装備検索などを継続的に改善中。",
  },
  {
    title: "Linda Terraza",
    image: "/images/works/lindaterraza-pc.webp",
    url: "https://lindaterraza.com/",
    tech: "WordPress",
    text: "宿泊・施設サイトとして、写真の見せ方、予約導線、スマートフォンでの閲覧体験を意識して制作。",
  },
  {
    title: "Mieko Noguchi",
    image: "/images/works/noguchi-mieko-pc.webp",
    url: "https://miekonoguchi.com/",
    tech: "HTML / CSS / JavaScript",
    text: "個人・ブランドの世界観を伝えるWebサイト。シンプルで上品な情報設計とデザインを意識して制作。",
  },
];

export default function MainContent() {
  return (
    <div className={styles.main}>
      <section className={styles.section}>
        <SectionTitle icon={<FaUserCircle />} title="PROFESSIONAL SUMMARY" />

        <ul className={styles.summaryList}>
          <li>4年以上のWeb開発・社内システム開発・業務改善の実務経験</li>
          <li>現場課題を発見し、仕組み化・自動化することで大幅な効率化を実現</li>
          <li>2024年よりルワンダにてプログラミング教育に英語で従事</li>
          <li>カリキュラム設計・教材開発・実践プロジェクト指導まで一貫して担当</li>
          <li>学習者中心の学習体験設計と、継続的な改善サイクルの構築が強み</li>
        </ul>
      </section>

      <section className={styles.section}>
        <SectionTitle icon={<FaBriefcase />} title="WORK EXPERIENCE" />

        <div className={styles.timeline}>
          {jobs.map((job) => (
            <article className={styles.job} key={job.title}>
              <div className={styles.date}>
                <span>{job.date.split(" - ")[1]}</span>
                <i />
                <span>{job.date.split(" - ")[0]}</span>
              </div>

              <div className={styles.jobContent}>
                <div className={styles.jobHeader}>
                  <h3>{job.title}</h3>
                  <span className={styles.jobTag}>{job.tag}</span>
                </div>

                <p className={styles.jobText}>{job.text}</p>

                <div className={styles.jobBody}>
                  <div className={styles.dutyBlock}>
                    <h4>主な業務</h4>
                    <ul>
                      {job.duties.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.achievement}>
                    <h4>
                      <FaChartLine />
                      {job.resultTitle}
                    </h4>
                    <ul>
                      {job.results.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <SectionTitle icon={<FaLaptopCode />} title="SELECTED WORKS" />

        <div className={styles.workList}>
          {projects.map((project) => (
            <article className={styles.workItem} key={project.title}>
              <div className={styles.workImage}>
                <Image
                  src={project.image}
                  alt={project.title}
                  width={180}
                  height={110}
                />
              </div>

              <div className={styles.workContent}>
                <div className={styles.workHead}>
                  <h3>{project.title}</h3>
                  <span>{project.tech}</span>
                </div>

                <p className={styles.workUrl}><a target="_blank" rel="noreferrer" href={project.url}>{project.url}</a></p>
                <p className={styles.workText}>{project.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.valueBox}>
        <div>
          <FaGraduationCap />
          <span>教育設計</span>
        </div>
        <div>
          <FaLaptopCode />
          <span>Web開発</span>
        </div>
        <div>
          <FaCheckCircle />
          <span>業務改善</span>
        </div>
        <div>
          <FaGlobeAfrica />
          <span>国際協働</span>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <h2 className={styles.sectionTitle}>
      <span>{icon}</span>
      {title}
    </h2>
  );
}
