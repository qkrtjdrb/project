import react from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Mypage from "./pages/Mypage";
import Concerts from "./pages/Concerts";
import {
  Routes,
  Route,
  Router,
  useNavigate,
  BrowserRouter,
} from "react-router-dom";
import SeatSelection from "./pages/SeatSelection";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Concerts" element={<Concerts />} />
          <Route path="/SeatSelection" element={<SeatSelection />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;