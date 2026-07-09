import styles from "./page.module.css";
import ResumeHeader from "./components/ResumeHeader";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import PrintPdfButton from "./components/PrintPdfButton";
import RegimeAuthGate from "./RegimeAuthGate";

export default function RegimePage() {
  return (
    <RegimeAuthGate>
      <main className={styles.wrapper}>
        <PrintPdfButton />

        <section className={styles.page}>
          <div className={styles.printScale}>
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
          </div>
        </section>
      </main>
    </RegimeAuthGate>
  );
}