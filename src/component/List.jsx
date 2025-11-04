import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './List.css';
import User from '../assets/user';

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
      const testChats = [
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
        {
          id: 3,
          username: '문강현',
          userId: '@g.hyxn1_',
          lastMessage: '저리가 ! 문강현 !',
          unread: true,
        },
      ];
      
      if (!accessToken) {
        setChatList(testChats);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChatList(data || testChats);
      } else {
        setChatList(testChats);
      }
    } catch (error) {
      console.error('채팅 목록 조회 오류:', error);
      setChatList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (id) => {
    navigate('/chat');
  };

  return (
    <div className="main-container">
      <div className="chat-box">
        <div className="chat-header">현재 채팅</div>

        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : (
          <div className="chat-list">
            {chatList.length === 0 ? (
              <div className="empty-state">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="91"
                  viewBox="0 0 100 91"
                  fill="none"
                  className="empty-icon"
                >
                  <path
                    d="M49.7901 2C39.4445 2 31.4028 2 25.1427 2.66925C18.8112 3.35189 13.7968 4.76625 9.79609 7.96082C5.68819 11.2446 3.76819 15.5145 2.86177 20.8997C2 26.0396 2 32.5804 2 40.7364V41.5529C2 49.5036 2 55.0049 2.89302 59.1052C3.37526 61.3137 4.13433 63.2323 5.32651 65.008C6.5053 66.757 8.00558 68.2294 9.79609 69.6571C12.6136 71.9103 15.9356 73.2711 19.8605 74.1188V85.6567C19.861 86.243 20.0156 86.8188 20.309 87.3266C20.6023 87.8343 21.0239 88.2562 21.5317 88.5499C22.0395 88.8435 22.6156 88.9988 23.2023 89C23.789 89.0012 24.3658 88.8484 24.8748 88.5568C27.4913 87.0622 29.8087 85.4336 31.9297 83.8988L33.2871 82.9128C34.7974 81.7829 36.34 80.6968 37.9129 79.6557C41.6815 77.2107 45.2804 75.6179 50 75.6179H50.2099C60.5555 75.6179 68.5972 75.6179 74.8573 74.9487C81.1888 74.266 86.2032 72.8517 90.2039 69.6571C91.99 68.2294 93.4947 66.757 94.669 65.008C95.8657 63.2323 96.6247 61.3137 97.107 59.1052C98 55.0049 98 49.5036 98 41.5529V40.7364C98 32.5804 98 26.0396 97.1382 20.9042C96.2318 15.5145 94.3118 11.2446 90.2039 7.96082C86.2032 4.76179 81.1888 3.35189 74.8573 2.67372C68.5972 2 60.5555 2 50.2099 2H49.7901Z"
                    stroke="#FF6B9F"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="empty-title">
                  아직 대화가 없어요.
                  <br />
                  랜덤 매칭으로 첫 대화를 시작해보세요!
                </div>
              </div>
            ) : (
              chatList.map((chat) => (
                <div
                  key={chat.id}
                  className="chat-item"
                  onClick={() => handleChatClick(chat.id)}
                >
                  <div className="profile">
                    <div className="avatar">
                      <User />
                    </div>
                  </div>
                  <div className="chat-info">
                    <div className="chat-username">
                      {chat.username} <span>{chat.userId}</span>
                    </div>
                    <div className="chat-message">{chat.lastMessage}</div>
                  </div>
                  {chat.unread && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}