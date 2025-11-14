import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/cookies';
import axios from 'axios';
import styles from './Random.module.css';
import Logo from '../assets/logo';

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
    accessTokenRef.current = getAccessToken();
    return () => {
      if (dotRef.current) clearInterval(dotRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const startMatching = async () => {
    try {
      setStatus('waiting');
      setDotCount(1);

      const response = await axios.post(
        `${API_BASE_URL}/api/chat/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessTokenRef.current}`,
            'Content-Type': 'application/json',
          },
        }
      );


      const chatListResponse = await axios.get(`${API_BASE_URL}/api/chat`, {
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
          'Content-Type': 'application/json',
        },
      });

      initialChatCountRef.current = chatListResponse.data?.length || 0;

      dotRef.current = setInterval(() => {
        setDotCount((prev) => (prev === 3 ? 1 : prev + 1));
      }, 1000);

      pollForMatch();
    } catch (error) {
      setStatus('idle');
      alert('매칭 요청 중 오류가 발생했습니다.');
    }
  };

  const pollForMatch = () => {
    pollingRef.current = setInterval(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/chat`, {
          headers: {
            Authorization: `Bearer ${accessTokenRef.current}`,
            'Content-Type': 'application/json',
          },
        });


        if (response.data && response.data.length > initialChatCountRef.current) {
          clearInterval(pollingRef.current);
          if (dotRef.current) clearInterval(dotRef.current);
          setStatus('matched');

          setTimeout(() => {
            navigate('/chat');
          }, 2000);
        }
      } catch (error) {
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
        <Logo />

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
            <div className={styles.queto}>매칭 중{'.'.repeat(dotCount)}</div>
            <div className={styles.longQueto}>잠시만 기다려주세요</div>
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
