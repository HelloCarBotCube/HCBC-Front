import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Random.module.css';

const API_BASE_URL = 'http://gsmsv-1.yujun.kr:27919';

export default function Random() {
  const [status, setStatus] = useState('idle');
  const [dotCount, setDotCount] = useState(1);
  const dotRef = useRef(null);
  const pollingRef = useRef(null);
  const accessTokenRef = useRef(null);
  const initialChatCountRef = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    accessTokenRef.current = localStorage.getItem('accessToken');
    return () => {
      if (dotRef.current) clearInterval(dotRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const startMatching = async () => {
    try {
      setStatus('waiting');
      setDotCount(1);

      const response = await fetch(`${API_BASE_URL}/api/chat/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessTokenRef.current}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('매칭 요청 실패');
      }

      const data = await response.json();
      console.log('매칭 요청 완료:', data);

      const chatListResponse = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessTokenRef.current}`,
          'Content-Type': 'application/json',
        },
      });
      const chatListData = await chatListResponse.json();
      initialChatCountRef.current = chatListData?.length || 0;

      dotRef.current = setInterval(() => {
        setDotCount((prev) => (prev === 3 ? 1 : prev + 1));
      }, 1000);

      pollForMatch();
    } catch (error) {
      console.error('매칭 시작 오류:', error);
      setStatus('idle');
      alert('매칭 요청 중 오류가 발생했습니다.');
    }
  };

  const pollForMatch = () => {
    pollingRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessTokenRef.current}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        console.log('채팅 목록 확인:', data?.length);

        if (data && data.length > initialChatCountRef.current) {
          clearInterval(pollingRef);
          if (dotRef.current) clearInterval(dotRef.current);
          setStatus('matched');
          console.log('매칭 완료!');
          
          setTimeout(() => {
            navigate('/Login');
          }, 2000);
        }
      } catch (error) {
        console.error('채팅 목록 조회 오류:', error);
      }
    }, 2000);
  };

  const cancelMatching = () => {
    if (dotRef.current) clearInterval(dotRef.current);
    if (pollingRef.current) clearInterval(pollingRef.current);

    setStatus('idle');
    setDotCount(1);
  };

  const handleReset = () => {
    if (dotRef.current) clearInterval(dotRef.current);
    if (pollingRef.current) clearInterval(pollingRef.current);

    setStatus('idle');
    setDotCount(1);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.all}>
        <svg
          className={styles.logo}
          width="216"
          height="216"
          viewBox="0 0 216 216"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 34.964C0 15.6539 15.6539 0 34.964 0H181.036C200.346 0 216 15.6539 216 34.964V181.036C216 200.346 200.346 216 181.036 216H34.964C15.6539 216 0 200.346 0 181.036V34.964Z"
            fill="url(#paint0_linear_122_454)"
          />
          <path
            d="M58.7914 171.194C54.5002 171.194 51.0216 167.716 51.0216 163.424V52.5755C51.0216 48.2844 54.5002 44.8058 58.7914 44.8058H77.5375C81.8286 44.8058 85.3073 48.2844 85.3073 52.5755V86.4065C85.3073 90.6976 88.7859 94.1763 93.0771 94.1763H122.923C127.214 94.1763 130.693 90.6976 130.693 86.4065V52.5755C130.693 48.2844 134.171 44.8058 138.462 44.8058H157.209C161.5 44.8058 164.978 48.2844 164.978 52.5755V163.424C164.978 167.716 161.5 171.194 157.209 171.194H138.462C134.171 171.194 130.693 167.716 130.693 163.424V129.594C130.693 125.302 127.214 121.824 122.923 121.824H93.0771C88.7859 121.824 85.3073 125.302 85.3073 129.594V163.424C85.3073 167.716 81.8286 171.194 77.5375 171.194H58.7914Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_122_454"
              x1="108"
              y1="0"
              x2="108"
              y2="216"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF649B" />
              <stop offset="1" stopColor="#FF9CB9" />
            </linearGradient>
          </defs>
        </svg>

        {status === 'idle' && (
          <>
            <div className={styles.queto}>오늘은 어떤 사람을 만나게 될까요?</div>
            <div className={styles.longQueto}>
              어떤 인연이 기다리고 있을지 지금 확인해 보세요.
              <br />
              대화는 우연처럼 찾아옵니다.
            </div>
            <button className={styles.randomButton} onClick={startMatching}>
              랜덤매칭
            </button>
          </>
        )}

        {status === 'waiting' && (
          <>
            <div className={styles.queto}>매칭 중{'.' .repeat(dotCount)}</div>
            <div className={styles.longQueto}>
              잠시만 기다려주세요
            </div>
            <button className={styles.cancelButton} onClick={cancelMatching}>
              매칭 취소
            </button>
          </>
        )}

        {status === 'matched' && (
          <>
            <div className={styles.queto}>매칭 완료!</div>
            <div className={styles.longQueto}>
              좋은 인연을 만났습니다.
              <br />
              이제 대화를 시작해보세요!
            </div>
            <button className={styles.randomButton} onClick={handleReset}>
              돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
