import NextTopLoader from "nextjs-toploader";

import AuthCard from "@/app/[locale]/(auth)/AuthCard";
import styles from "./Auth.module.css";

export const metadata = {
  title: "Admin",
};

const Layout = ({ children }) => {
  return (
    <div className={styles.shell}>
      <NextTopLoader />
      <AuthCard>{children}</AuthCard>
    </div>
  );
};

export default Layout;