const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const authMiddleware = require("./component/authMiddleware")

const app = express();

// JSON 형식의 요청 바디를 파싱하기 위해 필요
app.use(express.json());
app.use(cors()); // 필요한 경우에만 사용

// 실제로는 DB를 사용해야 하나, 예시에서는 간단히 배열에 저장
const users = [];

/**
 * 회원가입: POST /api/register
 * Request Body: { email, password }
 */
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) 이미 가입된 이메일인지 체크
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "이미 사용 중인 이메일입니다." });
    }

    // 2) 비밀번호 해싱
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 3) 새로운 사용자 객체 생성 및 저장(인메모리)
    const newUser = { email, password: hashedPassword };
    users.push(newUser);

    // 4) 응답
    return res.status(201).json({ message: "회원가입 성공!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
});

/**
 * 로그인: POST /api/login
 * Request Body: { email, password }
 */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) 사용자 확인
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    // 2) 비밀번호 비교
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    // 3) JWT 토큰 생성
    // 실제 서비스에선 secretKey를 환경 변수로 관리하거나 더 안전한 방법을 사용합니다.
    const token = jwt.sign({ email: user.email }, "secretKey", {
      expiresIn: "1h",
    });

    // 4) 클라이언트에 토큰 전송
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
});

app.get("/", (req, res) => {
  res.send("회원가입 서버");
});

// * 마이페이지 요청: GET /api/me *
app.get("/api/me", authMiddleware, async (req, res) => {
  // authMiddleware를 통과하면 req.user에 { email: ... } 같은 정보가 들어있음
  const userEmail = req.user.email; // 예: "test@test.com"

  // DB(또는 메모리)에서 해당 email의 사용자 정보 찾기
  // 예시) MongoDB:
  // const user = await User.findOne({ email: userEmail });

  // 여기서는 간단히 예시 객체를 내려줌
  const user = {
    email: userEmail,
    name: "홍길동",
    createdAt: "2024-01-01",
  };

  if (!user) {
    // 유저가 없으면 404 반환
    return res.status(404).json({ message: "해당 사용자를 찾을 수 없습니다." });
  }

  // 유저 정보 반환 (원하는 필드만)
  return res.json({
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  });
});

// 서버 실행
const PORT = 5010; // 원하는 포트 사용
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
