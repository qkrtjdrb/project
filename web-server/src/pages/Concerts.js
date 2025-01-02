import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import axios from "axios";

// 날짜 "YYYY년 MM월 DD일" 변환 예시
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
}

function Concerts() {
  const navigate = useNavigate();
  const [concerts, setConcerts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/Concerts")
      .then((response) => {
        setConcerts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Concerts:", error);
      });
  }, []);

  // (1) 대기열 등록 API 호출 함수
  const handleEnterQueue = async () => {
    try {
      // 서버에 '대기열 등록' 요청
      const response = await axios.post("http://localhost:3001/api/enter-queue");
      const data = response.data;

      // 서버가 { queueId: 'xxxx-xxx-xxxx', message: '...' } 같은 형태로 응답한다고 가정
      const { queueId } = data;

      // queueId를 이용해서 /queue 페이지로 이동
      // ① 쿼리 파라미터로 넘기거나
      navigate(`/queue?queueId=${queueId}`);

      // ② 또는 route state로 넘길 수도 있음
      // navigate('/queue', { state: { queueId } });

    } catch (error) {
      console.error("Error entering queue:", error);
      alert("대기열 진입 중 오류가 발생했습니다.");
    }
  };

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
      <Button onClick={() => navigate("/")}> 홈 </Button>

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

            {/* (2) 대기열 버튼 -> 대기열 등록 + /queue 페이지 이동 */}
            <Button onClick={handleEnterQueue}>
              콘서트 예매(대기열 입장)
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Concerts;