import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChatList.module.css';
import User from '../assets/user';
import Arrow from '../assets/arrow';

export default function Main() {
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([
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
      unread: false,
    },
    {
      id: 4,
      username: '문강현',
      userId: '@g.hyxn1_',
      lastMessage: '저리가 ! 문강현 !',
      unread: false,
    },
    {
      id: 5,
      username: '문강현',
      userId: '@g.hyxn1_',
      lastMessage: '저리가 ! 문강현 !',
      unread: false,
    },
  ]);

  const handleChatClick = (id) => {
    navigate('/chat');
  };

  return (
    <div className={styles['main-container']}>
      <div className={styles['chat-box']}>
        <div className={styles['chat-header']}>
          <p onClick={() => navigate('/main')}>
            <Arrow />
            홈으로 가기
          </p>
        </div>

        <div className={styles['chat-list']}>
          {chatList.map((chat) => (
            <div
              key={chat.id}
              className={styles['chat-item']}
              onClick={() => handleChatClick(chat.id)}
            >
              <div className={styles['profile']}>
                <div className={styles['avatar']}>
                  <User />
                </div>
              </div>
              <div className={styles['chat-info']}>
                <div className={styles['chat-username']}>
                  {chat.username}{' '}
                  <span className={styles['chat-username-span']}>{chat.userId}</span>
                </div>
                <div className={styles['chat-message']}>{chat.lastMessage}</div>
              </div>
              {chat.unread && <div className={styles['unread-dot']}></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
