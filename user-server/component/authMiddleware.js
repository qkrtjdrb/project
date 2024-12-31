// authMiddleware.js
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // 1) 요청 헤더에서 토큰 꺼내기
  const authHeader = req.headers.authorization; 
  // Bearer 토큰 방식을 가정: "Authorization: Bearer <JWT토큰>"

  if (!authHeader) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  const token = authHeader.split(" ")[1]; // "Bearer" 뒤의 실제 토큰 부분
  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  // 2) 토큰 검증
  try {
    // secretKey는 실제로는 .env 등 안전한 곳에서 관리
    const decoded = jwt.verify(token, "secretKey"); 
    // 예: { email: "test@test.com", iat: 1234567890, exp: 1234567890 }

    // 3) req.user에 담아서 넘김 → 이후 라우트에서 사용 가능
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "유효하지 않은 토큰" });
  }
}

module.exports = authMiddleware;
