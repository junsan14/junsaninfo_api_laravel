"use client";

import { MdPictureAsPdf } from "react-icons/md";
import styles from "./PrintPdfButton.module.css";

export default function PrintPdfButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button type="button" className={styles.printButton} onClick={handlePrint}>
      <MdPictureAsPdf />
      PDFで保存
    </button>
  );
}