import { useState, useEffect } from 'react';
import styles from './TokenDebug.module.css';

export default function TokenDebug() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [testToken, setTestToken] = useState('');

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    setToken(storedToken || '토큰 없음');
    setUserId(storedUserId || '사용자 ID 없음');
  };

  const saveToken = () => {
    if (testToken.trim()) {
      localStorage.setItem('token', testToken.trim());
      alert('토큰이 저장되었습니다!');
      checkToken();
    }
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    alert('토큰이 삭제되었습니다!');
    checkToken();
    setTestToken('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>토큰 디버깅</h1>

      <div className={styles.infoBox}>
        <h3>현재 저장된 정보:</h3>
        <p className={styles.tokenDisplay}>
          <strong>토큰:</strong>
          <br />
          <code className={styles.codeBlock}>{token}</code>
        </p>
        <p>
          <strong>사용자 ID:</strong> {userId}
        </p>
        <button onClick={checkToken} className={styles.refreshButton}>
          새로고침
        </button>
      </div>

      <div className={styles.inputBox}>
        <h3>테스트 토큰 입력:</h3>
        <input
          type="text"
          value={testToken}
          onChange={(e) => setTestToken(e.target.value)}
          placeholder="JWT 토큰을 입력하세요..."
          className={styles.tokenInput}
        />
        <div className={styles.buttonGroup}>
          <button onClick={saveToken} className={styles.saveButton}>
            토큰 저장
          </button>
          <button onClick={clearToken} className={styles.clearButton}>
            토큰 삭제
          </button>
        </div>
      </div>

      <div className={styles.loginLink}>
        <a href="/login" className={styles.loginButton}>
          로그인 페이지로 이동
        </a>
      </div>
    </div>
  );
}
