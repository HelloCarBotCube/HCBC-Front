import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/cookies';
import useChatStore from '../store/useChatStore';
import axios from 'axios';
import styles from './List.module.css';
import User from '../assets/user';
import Nochat from '../assets/nochat';

const API_BASE_URL = 'http://gsmsv-1.yujun.kr:27919';

export default function Main() {
  const navigate = useNavigate();
  const { setCurrentRoom } = useChatStore();
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLastReadTime = (roomId) => {
    try {
      const lastReadTimes = JSON.parse(localStorage.getItem('chat_last_read') || '{}');
      return lastReadTimes[roomId] || 0;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    fetchChatList();
    const interval = setInterval(fetchChatList, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchChatList = async () => {
    try {
      const accessToken = getAccessToken();
      const testChats = [];

      if (!accessToken) {
        setChatList(testChats);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/chat`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const uniqueChats = {};
      (Array.isArray(response.data) ? response.data : []).forEach((chat) => {
        const key = chat.opponentUserId;
        if (
          !uniqueChats[key] ||
          new Date(chat.lastActiveAt) > new Date(uniqueChats[key].lastActiveAt)
        ) {
          uniqueChats[key] = chat;
        }
      });

      const mappedData = Object.values(uniqueChats)
        .sort((a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt))
        .map((chat) => {
          const lastReadTime = getLastReadTime(chat.roomId);
          const lastActiveTime = new Date(chat.lastActiveAt).getTime();

          let lastSentTime = 0;
          try {
            const sentTimes = JSON.parse(localStorage.getItem('chat_last_sent') || '{}');
            lastSentTime = sentTimes[chat.roomId] || 0;
          } catch {}

          const hasUnread = lastActiveTime > lastReadTime && lastActiveTime > lastSentTime;

          return {
            roomId: chat.roomId,
            opponentId: chat.opponentLoginId,
            opponentUserId: chat.opponentUserId,
            username: chat.opponentName || '알 수 없는 사용자',
            userId: `@${chat.opponentLoginId}` || '@unknown',
            lastMessage: chat.lastMessage || '메시지 없음',
            unread: hasUnread,
            unreadCount: hasUnread ? 1 : 0,
          };
        });

      setChatList(mappedData.length > 0 ? mappedData : testChats);
    } catch (error) {
      console.error('채팅 목록 조회 오류:', error);
      setChatList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chat) => {
    try {
      const lastReadTimes = JSON.parse(localStorage.getItem('chat_last_read') || '{}');
      lastReadTimes[chat.roomId] = Date.now();
      localStorage.setItem('chat_last_read', JSON.stringify(lastReadTimes));
    } catch (error) {
      console.error('읽음 처리 오류:', error);
    }

    setCurrentRoom({
      roomId: chat.roomId,
      opponentId: chat.opponentId,
      opponentUserId: chat.opponentUserId,
      otherUserName: chat.username,
      tags: [],
      age: null,
      address: null,
      gender: null,
    });
    navigate('/chat');
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
                  key={chat.roomId}
                  className={styles['chat-item']}
                  onClick={() => handleChatClick(chat)}
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
