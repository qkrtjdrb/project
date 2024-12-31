// src/pages/MyPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Button from "../components/Button";

function MyPage() {
  const [userInfo, setUserInfo] = useState(null); // 유저 정보
  const [loading, setLoading] = useState(true);   // 로딩 상태
  const Navigate = useNavigate();

  useEffect(() => {
    // 1) 로컬 스토리지에서 JWT 토큰 불러오기
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 보낼 수도 있음
      alert("로그인이 필요합니다!");
      window.location.href = "/login";
      return;
    }

    // 2) 토큰을 헤더에 넣어서 GET /api/me 요청
    axios
      .get("http://localhost:5010/api/me", {
        headers: {
          // Authorization 헤더 형식: "Bearer <토큰>"
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // 응답 데이터에 유저 정보가 있음
        setUserInfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        // 만약 토큰이 만료되었거나 잘못된 경우 401 발생 → 로그인 페이지로
        window.location.href = "/login";
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (!userInfo) return <div>유저 정보를 불러오지 못했습니다.</div>;

  // userInfo에는 { email, name, createdAt } 등이 들어있을 것
  return (
    <div>
      <h2>마이페이지</h2>
      <p>이메일: {userInfo.email}</p>
      <p>이름: {userInfo.name}</p>
      <p>가입일: {userInfo.createdAt}</p>
      {/* 필요하면 더 많은 필드 표시 */}
      <Button onClick={() => Navigate("/")}> 홈 </Button>
    </div>
  );
}

export default MyPage;