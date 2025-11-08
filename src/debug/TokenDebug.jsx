import { useState, useEffect } from 'react';

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
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#ff6b9f', marginBottom: '30px' }}>🔐 토큰 디버깅</h1>

      <div
        style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
        }}
      >
        <h3>현재 저장된 정보:</h3>
        <p style={{ wordBreak: 'break-all' }}>
          <strong>토큰:</strong>
          <br />
          <code
            style={{
              background: '#fff',
              padding: '10px',
              display: 'block',
              marginTop: '10px',
              borderRadius: '6px',
            }}
          >
            {token}
          </code>
        </p>
        <p>
          <strong>사용자 ID:</strong> {userId}
        </p>
        <button
          onClick={checkToken}
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          새로고침
        </button>
      </div>

      <div
        style={{
          background: '#fff3cd',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
        }}
      >
        <h3>테스트 토큰 입력:</h3>
        <input
          type="text"
          value={testToken}
          onChange={(e) => setTestToken(e.target.value)}
          placeholder="JWT 토큰을 입력하세요..."
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            marginBottom: '10px',
            fontSize: '14px',
            fontFamily: 'monospace',
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={saveToken}
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            토큰 저장
          </button>
          <button
            onClick={clearToken}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            토큰 삭제
          </button>
        </div>
      </div>

      <div
        style={{
          background: '#d1ecf1',
          padding: '20px',
          borderRadius: '12px',
        }}
      >
        <h3>참고사항:</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>로그인을 하면 자동으로 토큰이 저장됩니다.</li>
          <li>
            401 에러가 발생하면 토큰이 만료되었거나 유효하지 않은 것입니다.
          </li>
          <li>
            브라우저 개발자 도구 (F12) → Console에서 상세 로그를 확인하세요.
          </li>
          <li>토큰은 백엔드에서 발급받아야 합니다.</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a
          href="/login"
          style={{
            display: 'inline-block',
            padding: '12px 30px',
            background: '#ff6b9f',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
          }}
        >
          로그인 페이지로 이동
        </a>
      </div>
    </div>
  );
}
