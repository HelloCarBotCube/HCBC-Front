import { useState } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo';
import IdIcon from '../assets/IdIcon';
import PwIcon from '../assets/pwIcon';
import EyeShow from '../assets/EyeShow';
import EyeHide from '../assets/EyeHide';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://gsmsv-1.yujun.kr:27919/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

function Login() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [message, setMessage] = useState('');
  const [showPw, setshowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const loginId = id.trim();
    const password = pw.trim();
    if (!loginId || !password) {
      setMessage('아이디와 비밀번호를 모두 입력하세요');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axiosInstance.post('/auth/signin', {
        loginId: loginId,
        password: password,
      });

      const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } =
        res.data || {};

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('accessTokenExpiresIn', accessTokenExpiresIn);
      localStorage.setItem('refreshTokenExpiresIn', refreshTokenExpiresIn);

      window.location.href = '/main';
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;

      if (status === 401) {
        setMessage('아이디 또는 비밀번호가 일치하지 않음');
      } else if (status === 500) {
        setMessage('서버 에러');
      } else {
        setMessage('네트워크 오류');
      }
      console.debug('[signin:error]', status, err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="all">
      <Logo />

      <span className="name">HCBC</span>

      <div className="input">
        <div className="inputBox">
          <span className="inputIcon">
            <IdIcon />
          </span>
          <input
            className="inputId"
            type="text"
            required
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div className="inputBox">
          <span className="inputIcon">
            <PwIcon />
          </span>
          <input
            type={showPw ? 'text' : 'password'}
            required
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <span className="pwToggle" onClick={() => setshowPw(!showPw)}>
            {showPw ? <EyeShow /> : <EyeHide />}
          </span>
        </div>
      </div>
      <div id="message">
        <span className="message">{message}</span>
      </div>

      <button className="l-btn" type="submit" onClick={handleLogin} disabled={loading}>
        로그인
      </button>

      <div className="footer">
        <span className="not">아직 회원이 아니라면?</span>
        <Link to="/signup"> 회원가입하기</Link>
      </div>
    </div>
  );
}

export default Login;
