import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../store/useChatStore';
import websocketService from '../services/websocket';
import { getChatHistory, getMyInfo } from '../services/chatApi';
import { getAccessToken } from '../utils/cookies';
import ChatList from './ChatList';
import ChatUser from './ChatUser';
import Message from '../assets/sentMessage';
import styles from './Chat.module.css';

export default function Chat() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const { currentRoom, messages, addMessage, setMessages } = useChatStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [myUserId, setMyUserId] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  const getUserIdFromToken = () => {
    const token = getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId || payload.id || payload.sub || payload.user_id;
      return userId;
    } catch (error) {
      console.error('토큰 파싱 오류:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    let userId = getUserIdFromToken();

    if (!userId) {
      getMyInfo()
        .then((userInfo) => {
          const id = userInfo.userId || userInfo.id;
          if (id) {
            setMyUserId(id);
          }
        })
        .catch((error) => {
          console.error('사용자 정보 조회 실패:', error.response?.status);
        });
    } else {
      setMyUserId(userId);
    }

    if (!websocketService.isConnected()) {
      websocketService.connect(
        token,
        () => {
          setWsConnected(true);
        },
        (error) => {
          console.error('WebSocket 연결 실패:', error);
          setWsConnected(false);
        }
      );
    } else {
      setWsConnected(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (!currentRoom?.roomId || !wsConnected) return;

    const loadChatHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const history = await getChatHistory(currentRoom.roomId);

        if (Array.isArray(history) && history.length > 0) {
          const formattedMessages = history.map((msg) => {
            const myUserIdNum = typeof myUserId === 'string' ? parseInt(myUserId) : myUserId;
            const senderIdNum =
              typeof msg.senderId === 'string' ? parseInt(msg.senderId) : msg.senderId;
            const isMine = myUserIdNum && senderIdNum && myUserIdNum === senderIdNum;

            return {
              id: `${msg.timestamp || msg.createdAt || Date.now()}-${
                msg.senderId
              }-${Math.random()}`,
              sender: isMine ? '나' : '상대',
              text: msg.content,
              time: formatTime(new Date(msg.timestamp || msg.createdAt || Date.now())),
              senderId: msg.senderId,
              timestamp: msg.timestamp || msg.createdAt,
            };
          });

          // 기존 localStorage의 메시지와 병합
          const existingMessages = messages || [];
          const mergedMessages = [...formattedMessages];

          // API에 없는 새로운 메시지만 추가
          existingMessages.forEach(existingMsg => {
            const isDuplicate = formattedMessages.some(apiMsg =>
              apiMsg.text === existingMsg.text &&
              apiMsg.senderId === existingMsg.senderId &&
              Math.abs((apiMsg.timestamp || 0) - (existingMsg.timestamp || 0)) < 1000
            );
            if (!isDuplicate && existingMsg.timestamp) {
              mergedMessages.push(existingMsg);
            }
          });

          // 타임스탬프로 정렬
          mergedMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

          setMessages(mergedMessages);
        }
      } catch (error) {
        if (error.response?.status === 500) {
        } else if (error.response?.status !== 404) {
          console.error('채팅 기록 불러오기 실패:', error.message);
        }
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();

    const handleMessage = (data) => {
      const myUserIdNum = typeof myUserId === 'string' ? parseInt(myUserId) : myUserId;
      const senderIdNum =
        typeof data.senderId === 'string' ? parseInt(data.senderId) : data.senderId;

      const isMyMessage = myUserIdNum && senderIdNum && myUserIdNum === senderIdNum;

      addMessage({
        id: `${data.timestamp || Date.now()}-${data.senderId}-${Math.random()}`,
        sender: isMyMessage ? '나' : '상대',
        text: data.content,
        time: formatTime(new Date(data.timestamp || Date.now())),
        senderId: data.senderId,
        timestamp: data.timestamp || Date.now(),
      });
    };

    websocketService.subscribeToRoom(currentRoom.roomId, handleMessage);

    return () => {
      websocketService.unsubscribeFromRoom(currentRoom.roomId);
    };
  }, [currentRoom?.roomId, myUserId, wsConnected, addMessage, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const formatMessageText = (text) => {
    const maxLength = 18;
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < text.length; i++) {
      currentLine += text[i];
      if (currentLine.length === maxLength) {
        lines.push(currentLine);
        currentLine = '';
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.join('\n');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = e.target.message.value.trim();
    if (!text) return;

    if (!currentRoom?.roomId) {
      alert('채팅방을 먼저 선택해주세요.');
      return;
    }

    if (!websocketService.isConnected()) {
      const token = getAccessToken();
      websocketService.connect(token, () => {
        websocketService.sendMessage(currentRoom.roomId, text);
      });
    } else {
      websocketService.sendMessage(currentRoom.roomId, text);
    }

    e.target.reset();
  };

  return (
    <div className={styles['chat-page']}>
      <div className={styles['chat-list-panel']}>
        <div className={styles['chat-list']}>
          <ChatList></ChatList>
        </div>
      </div>

      <div className={styles['chat-window']}>
        <div className={styles['chat-date']}>{formatDate(currentTime)}</div>
        {currentRoom ? (
          <div className={styles['chat-info-text']}>
            {currentRoom.otherUserName} 님과 채팅 중입니다
          </div>
        ) : (
          <div className={styles['chat-info-text']}>
            오늘은 어떤 사람을 만나게 될까요?
            <br />
            대화는 우연처럼 찾아옵니다.
          </div>
        )}

        <div className={styles.messages}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${
                msg.sender === '나' ? styles['my-message'] : styles['other-message']
              }`}
            >
              <p style={{ whiteSpace: 'pre-wrap' }}>{formatMessageText(msg.text)}</p>
              <span className={styles['msg-time']}>{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className={styles['message-input']} onSubmit={handleSendMessage}>
          <input
            type="text"
            name="message"
            autoComplete="off"
            placeholder="메시지 보내기"
            disabled={!currentRoom}
          />
          <button type="submit" disabled={!currentRoom}>
            <Message></Message>
          </button>
        </form>
      </div>

      <div className={styles['profile-panel']}>
        <div className={styles['profile-card']}>
          <ChatUser></ChatUser>
        </div>
      </div>
    </div>
  );
}
