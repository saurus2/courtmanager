import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainPage from "./MainPage";
import AdminPage from "./AdminPage";
import MemberPage from "./MemberPage";

function App() {
  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem("isAdmin") === "true"
  );

  useEffect(() => {
    sessionStorage.setItem("isAdmin", isAdmin ? "true" : "false");
  }, [isAdmin]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage setIsAdmin={setIsAdmin} />} />
        <Route
          path="/admin"
          element={isAdmin ? <AdminPage /> : <Navigate to="/" />}
        />
        <Route path="/member" element={<MemberPage setIsAdmin={setIsAdmin} />} />
      </Routes>
    </Router>
  );
}

export default App;
