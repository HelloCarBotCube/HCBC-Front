import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/cookies';
import useChatStore from '../store/useChatStore';
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
  const { setCurrentRoom } = useChatStore();

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

      // 먼저 현재 채팅 목록 개수 저장 (매칭 API 호출 전)
      const initialChatResponse = await axios.get(`${API_BASE_URL}/api/chat`, {
        headers: {
          Authorization: `Bearer ${accessTokenRef.current}`,
          'Content-Type': 'application/json',
        },
      });

      initialChatCountRef.current = initialChatResponse.data?.length || 0;

      // 매칭 시작 API 호출
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

      dotRef.current = setInterval(() => {
        setDotCount((prev) => (prev === 3 ? 1 : prev + 1));
      }, 1000);

      // 폴링 즉시 시작
      pollForMatch();
    } catch (error) {
      console.error('매칭 시작 오류:', error);
      setStatus('idle');
      alert('매칭 요청 중 오류가 발생했습니다.');
    }
  };

  const pollForMatch = () => {
    // 첫 번째 체크를 즉시 실행
    let checkCount = 0;

    const checkMatch = async () => {
      try {
        checkCount++;
        const response = await axios.get(`${API_BASE_URL}/api/chat`, {
          headers: {
            Authorization: `Bearer ${accessTokenRef.current}`,
            'Content-Type': 'application/json',
          },
        });

        const currentCount = response.data?.length || 0;

        if (currentCount > initialChatCountRef.current) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          if (dotRef.current) clearInterval(dotRef.current);

          setStatus('matched');

          // 새로 생성된 채팅방 정보 가져오기
          try {
            const newChatResponse = await axios.get(`${API_BASE_URL}/api/chat`, {
              headers: {
                Authorization: `Bearer ${accessTokenRef.current}`,
                'Content-Type': 'application/json',
              },
            });

            // 가장 최근 채팅방 (방금 생성된 채팅방) 찾기
            if (newChatResponse.data && newChatResponse.data.length > 0) {
              const sortedChats = [...newChatResponse.data].sort(
                (a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt)
              );
              const latestChat = sortedChats[0];

              // currentRoom 설정
              setCurrentRoom({
                roomId: latestChat.roomId,
                opponentId: latestChat.opponentLoginId,
                opponentUserId: latestChat.opponentUserId,
                otherUserName: latestChat.opponentName || '알 수 없는 사용자',
                tags: [],
                age: null,
                address: null,
                gender: null,
              });
            }
          } catch (error) {
            console.error('채팅방 정보 가져오기 실패:', error);
          }

          setTimeout(() => {
            navigate('/chat');
          }, 2000);
        }
      } catch (error) {
        console.error('채팅 목록 조회 오류:', error);
      }
    };

    // 즉시 첫 체크 실행
    checkMatch();

    // 이후 2초마다 체크
    pollingRef.current = setInterval(checkMatch, 2000);
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
