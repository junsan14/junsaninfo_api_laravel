import RequireAuth from "@/hooks/RequireAuth";

import styles from "./Admin.module.css";

export const metadata = {
  title: "Admin",
};

const AdminLayout = ({ children }) => {
  return (
    <RequireAuth>
      <div className={styles.shell}>{children}</div>
    </RequireAuth>
  );
};

export default AdminLayout;