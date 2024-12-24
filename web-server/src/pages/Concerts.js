import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import axios from "axios";

// 날짜를 "YYYY년 MM월 DD일" 형식으로 변환
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
}

function Concerts() {
  const Navigate = useNavigate();
  const [concerts, setConcerts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/Concerts') // 'backend'는 도커 Compose 서비스 이름
      .then((response) => {
        setConcerts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Concerts:", error);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1>Concerts</h1>
      <Button onClick={() => Navigate("/")}> 홈 </Button>
      <div style={{ display: "flex" }}>
        {concerts.map((concert, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <img
              src={concert.image_url}
              alt="Concert"
              style={{ width: "300px", height: "400px" }}
            />
            <p>시작 날짜: {formatDate(concert.start_date)}</p>
            <p>종료 날짜: {formatDate(concert.end_date)}</p>
            <Button onClick={() => Navigate("/SeatSelection")}> 콘서트 예매 </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Concerts;
