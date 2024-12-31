import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // LocalStorage에서 토큰 삭제
    localStorage.removeItem("jwtToken");

    // SessionStorage에서 토큰 삭제 (필요하면)
    sessionStorage.removeItem("jwtToken");

    // 로그아웃 후 로그인 페이지로 리다이렉트
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} style={buttonStyle}>
      로그아웃
    </button>
  );
};

// 간단한 스타일 예제
const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#ff6666",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default LogoutButton;