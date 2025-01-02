import react from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Mypage from "./pages/Mypage";
import Concerts from "./pages/Concerts";
import Register from "./pages/Register";
import QueuePage from "./pages/Queue";
import {
  Routes,
  Route,
  Router,
  useNavigate,
  BrowserRouter,
} from "react-router-dom";
import SeatSelection from "./pages/SeatSelection";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Concerts" element={<Concerts />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/SeatSelection" element={<PrivateRoute> <SeatSelection /> </PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;