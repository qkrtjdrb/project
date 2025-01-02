import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  // 로그인 버튼 클릭 시 실행될 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 로그인 API 호출
      const response = await axios.post("http://localhost:5010/api/login", {
        email,
        password,
      });

      // 토큰을 받아서 로컬 스토리지에 저장
      const { token } = response.data;
      localStorage.setItem("jwtToken", token);

      // 로그인 성공 후 메인 페이지로 이동
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("로그인 실패");
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">로그인</button>
        <Button onClick={() => Navigate("/Register")}> 회원가입 </Button>
      </form>
      <Button onClick={() => Navigate("/")}> 홈 </Button>
    </div>
  );
}

export default Login;
