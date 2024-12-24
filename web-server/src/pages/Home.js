import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../components/Home.css"

function Home() {
  const Navigate = useNavigate();
  return (
    <div className="home-container">
      <h1>Home</h1>
      <Button onClick={() => Navigate("/Login")}> 로그인 </Button>
      <Button onClick={() => Navigate("/Mypage")}> 마이 페이지 </Button>
      <Button onClick={() => Navigate("/Concerts")}> 콘서트 정보 </Button>
    </div>
  );
}

export default Home;
