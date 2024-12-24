const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 환경 변수
const PORT = process.env.PORT || 5001;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

let db;

// MySQL 연결 설정
async function connectToDatabase() {
  db = await mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });
  console.log("Connected to MySQL Database");
}

// 데이터베이스 연결
connectToDatabase().catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});

// 기본 엔드포인트
app.get("/", (req, res) => {
  res.send("Admin Server is running!");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Admin server is running on port ${PORT}`);
});

app.get("/reservations", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM reservations");
      res.json(rows);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).send("서버 오류");
    }
  });
// curl -X DELETE http://localhost:5001/reservations/id
  app.delete("/reservations/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await db.query("DELETE FROM reservations WHERE id = ?", [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).send("예약을 찾을 수 없습니다.");
      }
  
      res.send("예약이 성공적으로 취소되었습니다.");
    } catch (error) {
      console.error("Error canceling reservation:", error);
      res.status(500).send("서버 오류");
    }
  });

  app.put("/reservations/:id", async (req, res) => {
    const { id } = req.params;
    const { newDate } = req.body;
  
    if (!newDate) {
      return res.status(400).send("새로운 날짜를 제공해야 합니다.");
    }
  
    try {
      const [result] = await db.query(
        "UPDATE reservations SET date = ? WHERE id = ?",
        [newDate, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).send("예약을 찾을 수 없습니다.");
      }
  
      res.send("예약 날짜가 성공적으로 변경되었습니다.");
    } catch (error) {
      console.error("Error updating reservation date:", error);
      res.status(500).send("서버 오류");
    }
  });
  app.get("/test-mysql", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT 1");
      res.send("MySQL 연결 성공");
    } catch (error) {
      console.error("MySQL 연결 오류:", error);
      res.status(500).send("MySQL 연결 실패");
    }
  });