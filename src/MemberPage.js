import AdminPage from "./AdminPage";
import { useEffect } from "react";

function MemberPage({ setIsAdmin }) {
    useEffect(() => {
        setIsAdmin(false);
        sessionStorage.removeItem("isAdmin");
      }, [setIsAdmin]);
    return <AdminPage readOnly={true} />;
  }
export default MemberPage;
