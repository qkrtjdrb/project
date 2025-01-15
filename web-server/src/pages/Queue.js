// src/pages/QueuePage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function QueuePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queueId = searchParams.get("queueId");

  // 상태 변수들
  const [status, setStatus] = useState("WAITING"); 
  const [position, setPosition] = useState(null); // 내 앞에 몇 명인지

  useEffect(() => {
    if (!queueId) return; // queueId가 없으면 빠져나감

    const intervalId = setInterval(() => {
      axios
        .get(`https://stage.teenaa.shop:30010/api/queue-status?queueId=${queueId}`)
        .then((response) => {
          // 서버가 { status, position }을 내려준다고 가정
          const { status, position } = response.data;

          setStatus(status);
          if (typeof position === "number") {
            setPosition(position);
          } else {
            setPosition(null);
          }

          // READY면 좌석 선택 페이지로 이동 & 폴링 중단
          if (status === "READY") {
            clearInterval(intervalId);
            navigate("/SeatSelection");
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus("FAILED");
          clearInterval(intervalId);
        });
    }, 3000); // 3초마다 폴링

    // 언마운트 시 interval 해제
    return () => clearInterval(intervalId);
  }, [queueId, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      {status === "WAITING" && (
        <>
          <h2>대기 중입니다...</h2>
          {/* position이 null이 아닐 때만 표시 */}
          {position !== null && (
            <p>내 앞에 {position}명 대기 중</p>
          )}
        </>
      )}

      {status === "PROCESSING" && (
        <h2>서버가 작업 중입니다...</h2>
      )}

      {status === "READY" && (
        <h2>처리가 완료되었습니다! 좌석 선택 페이지로 이동 중...</h2>
      )}

      {status === "FAILED" && (
        <h2>오류가 발생했습니다. 다시 시도해 주세요.</h2>
      )}
    </div>
  );
}

export default QueuePage;