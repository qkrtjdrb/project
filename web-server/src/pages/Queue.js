// src/pages/QueuePage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function QueuePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queueId = searchParams.get("queueId");

  const [status, setStatus] = useState("WAITING"); // or PROCESSING, READY, FAILED, etc.

  useEffect(() => {
    if (!queueId) return; // queueId 없으면 그냥 빠져나오기

    const intervalId = setInterval(() => {
      axios
        .get(`http://localhost:3001/api/queue-status?queueId=${queueId}`)
        .then((response) => {
          const { status } = response.data;
          setStatus(status);

          // READY면 좌석 선택 페이지로 이동 후 폴링 중단
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
    }, 3000); // 3초마다 상태 확인

    return () => clearInterval(intervalId);
  }, [queueId, navigate]);

  return (
    <div>
      {status === "WAITING" && <p>대기중입니다... (queueId: {queueId})</p>}
      {status === "PROCESSING" && <p>서버가 작업 중입니다...</p>}
      {status === "READY" && <p>처리가 완료되었습니다! 좌석 선택 페이지로 이동 중...</p>}
      {status === "FAILED" && <p>오류가 발생했습니다. 다시 시도하세요.</p>}
    </div>
  );
}

export default QueuePage;