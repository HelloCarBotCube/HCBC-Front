import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatList from './ChatList';
import ChatUser from './ChatUser';
import Message from '../assets/sentMessage';
import './Chat.css';

export default function Chat() {
  const navigate = useNavigate();

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

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = e.target.message.value.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: '나', text, time: '13:30' }]);
    e.target.reset();
  };

  return (
    <div className="chat-page">
      {/* 왼쪽 사이드 채팅 목록 */}
      <div className="chat-list-panel">
        <div className="go-home">{'← 홈으로 가기'}</div>
        <div className="chat-list">
          <ChatList></ChatList>
        </div>
      </div>

      {/* 중앙 채팅 내용 */}
      <div className="chat-window">
        <div className="chat-date">2025년 9월 12일</div>
        <div className="chat-info-text">문강현 님이 채팅을 보냈습니다</div>

        <div className="messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === '나' ? 'my-message' : 'other-message'}`}
            >
              <p>{msg.text}</p>
              <span>{msg.time}</span>
            </div>
          ))}
        </div>

        <form className="message-input" onSubmit={handleSendMessage}>
          <input type="text" name="message" placeholder="메시지 보내기" />
          <button type="submit">
            <Message></Message>
          </button>
        </form>
      </div>

      {/* 오른쪽 상대 프로필 */}
      <div className="profile-panel">
        <div className="profile-card">
          <ChatUser></ChatUser>
        </div>
      </div>
    </div>
  );
}
