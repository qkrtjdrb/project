import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // 토큰 가져오기 (localStorage나 sessionStorage에서 가져옵니다)
  const token = localStorage.getItem("jwtToken");

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!token) {
    alert("로그인이 필요합니다!");
    return <Navigate to="/login" replace />;
  }

  // 토큰이 있으면 해당 컴포넌트 렌더링
  return children;
};

export default PrivateRoute;