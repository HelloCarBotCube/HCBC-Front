import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import EyeHide from "../assets/eyeHide";
import EyeShow from "../assets/eyeShow";
import PwIcon from "../assets/pwIcon";
import IdIcon from "../assets/idIcon";
import Logo from "../assets/logo";

function App() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [message, setMessage] = useState("");
  const [showPw, setshowPw] = useState(false);
  const handleLogin = () => {
    setMessage("");
    try {
      const raw = localStorage.getItem("hcbc_users");
      const users = raw ? JSON.parse(raw) : [];
      if (!users || users.length === 0) {
        setMessage("등록된 회원이 없습니다. 먼저 회원가입 해주세요.");
        return;
      }
      const matched = users.find((u) => u.id === id && u.password === pw);
      if (matched) {
        // 로그인 성공
        navigate("/main");
      } else {
        setMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (e) {
      console.error("login error", e);
      setMessage("로그인 중 오류가 발생했습니다.");
    }
  };
  return (
    <div className="login-page">
      <Logo></Logo>
      <span className="name">HCBC</span>
      <div className="input">
        <div className="inputBox">
          <span className="inputIcon">
            <IdIcon></IdIcon>
          </span>
          <input
            className="inputId"
            type="text"
            required
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
          ></input>
        </div>
        <div className="inputBox">
          <span className="inputIcon">
            <PwIcon></PwIcon>
          </span>
          <input
            type={showPw ? "text" : "password"}
            required
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          ></input>
          <span className="pwToggle" onClick={() => setshowPw(!showPw)}>
            {showPw ? <EyeShow></EyeShow> : <EyeHide></EyeHide>}
          </span>
        </div>
      </div>
      <div id="message">
        <span className="message">{message} </span>
      </div>
      <button className="login-button" type="submit" onClick={handleLogin}>
        로그인
      </button>
      <div className="footer">
        <span className="not">아직 회원이 아니라면?</span>
        <a className="link" href="/signup">
          회원가입하기
        </a>
      </div>
    </div>
  );
}
export default App;
