import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './List.module.css';
import User from '../assets/user';
import Nochat from '../assets/nochat';

const API_BASE_URL = 'http://gsmsv-1.yujun.kr:27919';

export default function Main() {
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChatList();
    const interval = setInterval(fetchChatList, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchChatList = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const testChats = [];
      
      if (!accessToken) {
        setChatList(testChats);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/chat`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const uniqueChats = {};
      (Array.isArray(response.data) ? response.data : []).forEach((chat) => {
        const key = chat.opponentUserId;
        if (!uniqueChats[key] || new Date(chat.lastActiveAt) > new Date(uniqueChats[key].lastActiveAt)) {
          uniqueChats[key] = chat;
        }
      });
      
      const mappedData = Object.values(uniqueChats)
        .sort((a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt))
        .map((chat) => ({
          id: chat.roomId,
          username: chat.opponentName || '알 수 없는 사용자',
          userId: `@${chat.opponentLoginId}` || '@unknown',
          lastMessage: chat.lastMessage || '메시지 없음',
          unread: false,
        }));

      setChatList(mappedData.length > 0 ? mappedData : testChats);
    } catch (error) {
      console.error('채팅 목록 조회 오류:', error);
      setChatList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (id) => {
    navigate('/chat', { state: { chatId: id } });
  };

  return (
    <div className={styles['main-container']}>
      <div className={styles['chat-box']}>
        <div className={styles['chat-header']}>현재 채팅</div>

        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : (
          <div className={styles['chat-list']}>
            {chatList.length === 0 ? (
              <div className={styles['empty-state']}>
                <Nochat />
                <div className={styles['empty-title']}>
                  아직 대화가 없어요.
                  <br />
                  랜덤 매칭으로 첫 대화를 시작해보세요!
                </div>
              </div>
            ) : (
              chatList.map((chat) => (
                <div
                  key={chat.id}
                  className={styles['chat-item']}
                  onClick={() => handleChatClick(chat.id)}
                >
                  <div className={styles.avatar}>
                    <User />
                  </div>
                  <div className={styles['chat-info']}>
                    <div className={styles['chat-username']}>
                      {chat.username} <span>{chat.userId}</span>
                    </div>
                    <div className={styles['chat-message']}>{chat.lastMessage}</div>
                  </div>
                  {chat.unread && <div className={styles['unread-dot']}></div>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}