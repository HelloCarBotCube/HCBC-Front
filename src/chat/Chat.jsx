import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatList from './ChatList';
import ChatUser from './ChatUser';
import Message from '../assets/sentMessage';
import styles from './Chat.module.css';

export default function Chat() {
  const navigate = useNavigate();

  // 현재 시간 상태 추가
  const [currentTime, setCurrentTime] = useState(new Date());

  const [chatList] = useState([
    {
      id: 1,
      username: '봉봉지',
      userId: '@bong_11111',
      lastMessage: 'ㅎㅇ염',
      unread: true,
    },
    {
      id: 2,
      username: '문강현',
      userId: '@g.hyxn1_',
      lastMessage: '저리가 ! 문강현 !',
      unread: false,
    },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: '상대', text: '인스타 아이디 ㄱㄴ?', time: '13:21' },
    { id: 2, sender: '나', text: '저리가 ! 문강현 !', time: '13:24' },
  ]);

  // 1초마다 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 시간을 HH:MM 형식으로 변환하는 함수
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 날짜를 "YYYY년 M월 D일" 형식으로 변환하는 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = e.target.message.value.trim();
    if (!text) return;

    // 현재 시간으로 메시지 전송
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: '나',
        text,
        time: formatTime(new Date()),
      },
    ]);
    e.target.reset();
  };

  return (
    <div className={styles['chat-page']}>
      {/* 왼쪽 사이드 채팅 목록 */}
      <div className={styles['chat-list-panel']}>
        <div className={styles['chat-list']}>
          <ChatList></ChatList>
        </div>
      </div>

      {/* 중앙 채팅 내용 */}
      <div className={styles['chat-window']}>
        {/* 현재 날짜로 변경 */}
        <div className={styles['chat-date']}>{formatDate(currentTime)}</div>
        <div className={styles['chat-info-text']}>문강현 님이 채팅을 보냈습니다</div>

        <div className={styles.messages}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.sender === '나' ? styles['my-message'] : styles['other-message']
              }`}
            >
              <p>{msg.text}</p>
              <span className="msg.time">{msg.time}</span>
            </div>
          ))}
        </div>

        <form className={styles['message-input']} onSubmit={handleSendMessage}>
          <input type="text" name="message" placeholder="메시지 보내기" />
          <button type="submit">
            <Message></Message>
          </button>
        </form>
      </div>

      {/* 오른쪽 상대 프로필 */}
      <div className={styles['profile-panel']}>
        <div className={styles['profile-card']}>
          <ChatUser></ChatUser>
        </div>
      </div>
    </div>
  );
}
