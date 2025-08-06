import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaUsers } from "react-icons/fa";
import { fetchPlayers } from "./api";

function MainPage({ setIsAdmin }) {
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(false);
    sessionStorage.removeItem("isAdmin");
  }, [setIsAdmin]);

  const handleAdminClick = () => {
    const password = prompt("관리자 비밀번호를 입력하세요:");
    if (password === "admin1234") {
      setIsAdmin(true);
      sessionStorage.setItem("isAdmin", "true");
      navigate("/admin", { replace: true });
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleMemberClick = () => {
    sessionStorage.removeItem("isAdmin");
    navigate("/member");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 space-y-12">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent tracking-wide leading-tight pb-2">
        Court Manager
      </h1>

      <div className="flex space-x-12">
        <button
          onClick={handleAdminClick}
          className="flex flex-col items-center justify-center w-48 h-32 rounded-lg bg-blue-500 hover:bg-blue-600 transition transform hover:scale-105 shadow-lg text-white"
        >
          <FaUserShield size={36} className="mb-3" />
          <span className="text-lg font-semibold">Admin</span>
        </button>

        <button
          onClick={handleMemberClick}
          className="flex flex-col items-center justify-center w-48 h-32 rounded-lg bg-green-500 hover:bg-green-600 transition transform hover:scale-105 shadow-lg text-white"
        >
          <FaUsers size={36} className="mb-3" />
          <span className="text-lg font-semibold">Members</span>
        </button>
      </div>
    </div>

  );
}

export default MainPage;
