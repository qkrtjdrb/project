const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 환경 변수 로드
const PORT = 5000;
const DB_HOST = process.env.DB_HOST || "concerts-server-db";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "root";
const DB_NAME = process.env.DB_NAME || "concerts";
const DB_PORT = process.env.DB_PORT || "3306"

let db;



// MySQL 연결
async function connectToDatabase() {
  db = await mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    DB_PORT,
  });
  console.log("Connected to MySQL Database");
}

connectToDatabase().catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});

app.post("/reserve-seat", async (req, res) => {
    const { concertId, seat } = req.body;
  
    if (!concertId || !seat) {
      return res.status(400).send("콘서트 ID와 좌석 정보를 제공해야 합니다.");
    }
  
    try {
      // 예약된 좌석인지 확인
      const [existingReservation] = await db.query(
        "SELECT * FROM reservations WHERE concert_id = ? AND seat = ?",
        [concertId, seat]
      );
  
      if (existingReservation.length > 0) {
        return res.status(400).send("이미 예약된 좌석입니다.");
      }
  
      // 예약 정보 저장
      await db.query(
        "INSERT INTO reservations (concert_id, seat) VALUES (?, ?)",
        [concertId, seat]
      );
  
      res.send("예매 완료!");
    } catch (error) {
      console.error("Error saving reservation:", error);
      res.status(500).send("서버 오류");
    }
  });
  

// API 엔드포인트
app.get("/concerts", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM concerts");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching concerts:", error);
    res.status(500).send("Server error");
  }
});

// 루트 경로에 기본 응답 추가
app.get("/", (req, res) => {
    res.send("Backend server is running!");
  });

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});