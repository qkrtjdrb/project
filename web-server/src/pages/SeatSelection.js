import React, { useState } from "react";
import axios from "axios";

function SeatSelection() {
  const [selectedSeat, setSelectedSeat] = useState(null);

  const seats = Array.from({ length: 10 }, (_, i) => `좌석 ${i + 1}`); // 예제 좌석 배열

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
  };



  const handleReservation = () => {
    if (selectedSeat) {
      axios
        .post("http://localhost:5000/reserve-seat", {
          concertId: 1, // 예제 콘서트 ID
          seat: selectedSeat,
        })
        .then(() => {
          alert(`예매 완료! 선택된 좌석: ${selectedSeat}`);
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            alert("이미 예약된 좌석입니다. 다른 좌석을 선택하세요.");
          } else {
            console.error("Error reserving seat:", error);
            alert("예매 실패! 다시 시도하세요.");
          }
        });
    } else {
      alert("좌석을 선택하세요!");
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
      <h1>좌석 선택</h1>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {seats.map((seat, index) => (
          <button
            key={index}
            onClick={() => handleSeatClick(seat)}
            style={{
              margin: "10px",
              padding: "10px",
              backgroundColor: selectedSeat === seat ? "lightgreen" : "lightgray",
            }}
          >
            {seat}
          </button>
        ))}
      </div>
      <button onClick={handleReservation} style={{ marginTop: "20px" }}>
        예매
      </button>
    </div>
  );
}



export default SeatSelection;