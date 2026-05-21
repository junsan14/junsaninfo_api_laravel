import styles from "./page.module.css";
import ResumeHeader from "./components/ResumeHeader";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

export default function RegimePage() {
  return (
    <main className={styles.wrapper}>
      <section className={styles.page}>
        <ResumeHeader />

        <div className={styles.body}>
          <Sidebar />
          <MainContent />
        </div>

        <footer className={styles.footer}>
          <strong>このような価値を提供できます</strong>
          <span>学習者中心のカリキュラム設計</span>
          <span>現場課題の仕組み化・自動化</span>
          <span>技術力 × 教育力 × 調整力</span>
          <span>国際環境での柔軟な対応力</span>
        </footer>
      </section>
    </main>
  );
}