// index.js (또는 server.js 등)
import express from "express"
import cors from "cors"
import "dotenv/config"

import mysql from "mysql2/promise";

import { adminJs, router as adminRouter } from "./admin.js"
import { sequelize } from "./databases.js"

const app = express();
app.use(cors());
app.use(express.json());

// 환경 변수
const PORT = process.env.PORT || 5001;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// MySQL 연결
let db;
async function connectToDatabase() {
  db = await mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });
  console.log("Connected to MySQL Database");
}

connectToDatabase().catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});

// 기본 엔드포인트
app.get("/", (req, res) => {
  res.send("Admin Server is running!");
});

// 예: 예약 취소
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

// 예: 예약 날짜 변경
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

// MySQL 연결 테스트
app.get("/test-mysql", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.send("MySQL 연결 성공");
  } catch (error) {
    console.error("MySQL 연결 오류:", error);
    res.status(500).send("MySQL 연결 실패");
  }
});

// 콘서트 등록
app.post("/concerts", async (req, res) => {
  const { name, imageUrl, startDate, endDate } = req.body;
  if (!name || !startDate || !endDate) {
    return res
      .status(400)
      .send("모든 필드를 제공해야 합니다. (name, startDate, endDate)");
  }
  try {
    const [result] = await db.query(
      "INSERT INTO concerts (name, image_url, start_date, end_date) VALUES (?, ?, ?, ?)",
      [name, imageUrl, startDate, endDate]
    );
    if (result.affectedRows > 0) {
      res.status(201).send("콘서트 정보가 성공적으로 추가되었습니다.");
    } else {
      res.status(500).send("콘서트 정보를 추가하지 못했습니다.");
    }
  } catch (error) {
    console.error("Error adding concert:", error);
    res.status(500).send("서버 오류");
  }
});

// 콘서트 조회
app.get("/concerts", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM concerts");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching concerts:", error);
    res.status(500).send("서버 오류");
  }
});

// 콘서트 삭제
app.delete("/concerts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM concerts WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send("콘서트를 찾을 수 없습니다.");
    }
    res.send("콘서트가 성공적으로 삭제되었습니다.");
  } catch (error) {
    console.error("Error deleting concert:", error);
    res.status(500).send("서버 오류");
  }
});

// AdminJS 붙이기
app.use(adminJs.options.rootPath, adminRouter);

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("서버 시작!");
    console.log(`AdminJS: http://localhost:${PORT}${adminJs.options.rootPath}`);
  } catch (error) {
    console.error("DB 연결 실패:", error);
    process.exit(1);
  }
});