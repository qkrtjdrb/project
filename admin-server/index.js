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
    const [result] = await db.query("DELETE FROM reservations WHERE id = ?", [
      id,
    ]);

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
//콘서트추가 //curl -X POST http://localhost:5001/concerts -H "Content-Type: application/json" -d "{\"name\":\"BTS World Tour\", \"imageUrl\":\"https://i.namu.wiki/i/gQLfFwpdbNZJOK60PKrK_U7AlpK_1raHj6M3k0S5DZ9g1J62ugbJ7jlJSr0C0z4fWFr9K7Y3chfix85BaRW88xNNGBqx_JfTcYdPAayPgw0wE1on_14uNrEv2K7nHnE3KccSUlwg9PtTYh0Key8KXg.webp\", \"startDate\":\"2024-12-01\", \"endDate\":\"2024-12-31\"}"
app.post("/concerts", async (req, res) => {
  const { name, imageUrl, startDate, endDate } = req.body;

  console.log("요청 데이터:", req.body); // 요청 데이터 출력

  // 모든 필드가 제공되었는지 확인
  if (!name || !startDate || !endDate) {
    return res
      .status(400)
      .send("모든 필드를 제공해야 합니다. (name, startDate, endDate)");
  }

  try {
    // 데이터베이스에 콘서트 추가
    const [result] = await db.query(
      "INSERT INTO concerts (name, image_url, start_date, end_date) VALUES (?, ?, ?, ?)",
      [name, imageUrl, startDate, endDate]
    );

    console.log("DB 응답:", result); // DB 응답 출력

    if (result.affectedRows > 0) {
      res.status(201).send("콘서트 정보가 성공적으로 추가되었습니다.");
    } else {
      res.status(500).send("콘서트 정보를 추가하지 못했습니다.");
    }
  } catch (error) {
    console.error("Error adding concert:", error); // 오류 메시지 출력
    res.status(500).send("서버 오류");
  }
});
// 모든 콘서트 조회
app.get("/concerts", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM concerts");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching concerts:", error);
    res.status(500).send("서버 오류");
  }
});
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