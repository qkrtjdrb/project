import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5010/api/register", {
        email,
        password,
      });
      alert(response.data.message); // "회원가입 성공!" 등
      // 회원가입 후 추가 액션(예: 로그인 페이지로 이동)
      // window.location.href = "/login";
    } catch (error) {
      console.error(error);
      // 서버가 반환한 에러 메시지를 alert
      alert(error.response?.data?.message || "회원가입 실패");
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">회원가입</button>
      </form>
      <Button onClick={() => Navigate("/")}> 홈 </Button>
    </div>
  );
}

export default Register;