import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useChatStore from "../store/useChatStore";
import websocketService from "../services/websocket";
import { getChatHistory, getMyInfo } from "../services/chatApi";
import { getAccessToken } from "../utils/cookies";
import ChatList from "./ChatList";
import ChatUser from "./ChatUser";
import Message from "../assets/sentMessage";
import styles from "./Chat.module.css";

export default function Chat() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const wsCheckIntervalRef = useRef(null);
  const isConnectingRef = useRef(false);

  // 선택적 구독: 필요한 것만 가져오기
  const currentRoom = useChatStore((state) => state.currentRoom);
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const setMessages = useChatStore((state) => state.setMessages);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [myUserId, setMyUserId] = useState(null);
  const [wsConnected, setWsConnected] = useState(
    websocketService.isConnected()
  );

  const getUserIdFromToken = () => {
    const token = getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId =
        payload.userId || payload.id || payload.sub || payload.user_id;
      return userId;
    } catch (error) {
      console.error("토큰 파싱 오류:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
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
          console.error("사용자 정보 조회 실패:", error.response?.status);
        });
    } else {
      setMyUserId(userId);
    }

    // WebSocket 연결 상태를 지속적으로 확인
    const connectWebSocket = () => {
      // 이미 연결 시도 중이면 중복 실행 방지
      if (isConnectingRef.current) {
        return;
      }

      if (!websocketService.isConnected()) {
        isConnectingRef.current = true;
        websocketService.connect(
          token,
          () => {
            setWsConnected(true);
            isConnectingRef.current = false;
          },
          (error) => {
            console.error("WebSocket 연결 실패:", error);
            setWsConnected(false);
            isConnectingRef.current = false;
          }
        );
      } else {
        setWsConnected(true);
      }
    };

    // 초기 연결 시도
    connectWebSocket();

    // 연결 확인을 위한 interval (3초마다 체크)
    wsCheckIntervalRef.current = setInterval(() => {
      const isConnected = websocketService.isConnected();

      if (isConnected !== wsConnected) {
        setWsConnected(isConnected);
      }

      // 연결이 끊어졌고 연결 시도 중이 아니면 재연결
      if (!isConnected && !isConnectingRef.current) {
        connectWebSocket();
      }
    }, 3000);

    return () => {
      if (wsCheckIntervalRef.current) {
        clearInterval(wsCheckIntervalRef.current);
      }
    };
  }, [navigate]);

  useEffect(() => {
    if (!currentRoom?.roomId || !wsConnected) {
      return;
    }

    const loadChatHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const history = await getChatHistory(currentRoom.roomId);

        if (Array.isArray(history) && history.length > 0) {
          const formattedMessages = history.map((msg) => {
            const myUserIdNum =
              typeof myUserId === "string" ? parseInt(myUserId) : myUserId;
            const senderIdNum =
              typeof msg.senderId === "string"
                ? parseInt(msg.senderId)
                : msg.senderId;
            const isMine =
              myUserIdNum && senderIdNum && myUserIdNum === senderIdNum;

            return {
              id: `${msg.timestamp || msg.createdAt || Date.now()}-${
                msg.senderId
              }-${Math.random()}`,
              sender: isMine ? "나" : "상대",
              text: msg.content,
              time: formatTime(
                new Date(msg.timestamp || msg.createdAt || Date.now())
              ),
              senderId: msg.senderId,
            };
          });
          setMessages(formattedMessages);
        }
      } catch (error) {
        if (error.response?.status !== 500 && error.response?.status !== 404) {
          console.error("채팅 기록 불러오기 실패:", error.message);
        }
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();

    const handleMessage = (data) => {
      const myUserIdNum =
        typeof myUserId === "string" ? parseInt(myUserId) : myUserId;
      const senderIdNum =
        typeof data.senderId === "string"
          ? parseInt(data.senderId)
          : data.senderId;

      const isMyMessage =
        myUserIdNum && senderIdNum && myUserIdNum === senderIdNum;

      addMessage({
        id: `${data.timestamp || Date.now()}-${data.senderId}-${Math.random()}`,
        sender: isMyMessage ? "나" : "상대",
        text: data.content,
        time: formatTime(new Date(data.timestamp || Date.now())),
        senderId: data.senderId,
      });
    };

    websocketService.subscribeToRoom(currentRoom.roomId, handleMessage);

    return () => {
      websocketService.unsubscribeFromRoom(currentRoom.roomId);
    };
  }, [currentRoom, myUserId, wsConnected, addMessage, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

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

    if (!currentRoom?.roomId) {
      alert("채팅방을 먼저 선택해주세요.");
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
    <div className={styles["chat-page"]}>
      <div className={styles["chat-list-panel"]}>
        <div className={styles["chat-list"]}>
          <ChatList></ChatList>
        </div>
      </div>

      <div className={styles["chat-window"]}>
        <div className={styles["chat-date"]}>{formatDate(currentTime)}</div>
        {currentRoom ? (
          <div className={styles["chat-info-text"]}>
            {currentRoom.otherUserName} 님과 채팅 중입니다
          </div>
        ) : (
          <div className={styles["chat-info-text"]}>
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
                msg.sender === "나"
                  ? styles["my-message"]
                  : styles["other-message"]
              }`}
            >
              <p>{msg.text}</p>
              <span className={styles["msg-time"]}>{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className={styles["message-input"]} onSubmit={handleSendMessage}>
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

      <div className={styles["profile-panel"]}>
        <div className={styles["profile-card"]}>
          <ChatUser></ChatUser>
        </div>
      </div>
    </div>
  );
}
