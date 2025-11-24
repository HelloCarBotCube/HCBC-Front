import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useChatStore from "../store/useChatStore";
import { getChatRooms } from "../services/chatApi";
import styles from "./ChatList.module.css";
import User from "../assets/user";
import Arrow from "../assets/arrow";

export default function Main() {
  const navigate = useNavigate();
  const { rooms, setRooms, currentRoom, setCurrentRoom } = useChatStore();

  const getLastReadTime = (roomId) => {
    try {
      const lastReadTimes = JSON.parse(localStorage.getItem('chat_last_read') || '{}');
      return lastReadTimes[roomId] || 0;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        const data = await getChatRooms(50);

        const uniqueChats = {};
        (Array.isArray(data) ? data : []).forEach((chat) => {
          const key = chat.opponentUserId;
          if (
            !uniqueChats[key] ||
            new Date(chat.lastActiveAt) >
              new Date(uniqueChats[key].lastActiveAt)
          ) {
            uniqueChats[key] = chat;
          }
        });

        const mappedRooms = Object.values(uniqueChats)
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
              otherUserName: chat.opponentName || "알 수 없는 사용자",
              lastMessage: chat.lastMessage || "메시지 없음",
              lastActiveAt: chat.lastActiveAt,
              tags: [],
              age: null,
              address: null,
              gender: null,
              unread: hasUnread,
            };
          });

        setRooms(mappedRooms);
      } catch (error) {
        if (error.response?.status !== 401) {
        }
      }
    };

    loadChatRooms();
    const interval = setInterval(loadChatRooms, 3000);
    return () => clearInterval(interval);
  }, [setRooms]);

  const handleChatClick = (room) => {
    try {
      const lastReadTimes = JSON.parse(localStorage.getItem('chat_last_read') || '{}');
      lastReadTimes[room.roomId] = Date.now();
      localStorage.setItem('chat_last_read', JSON.stringify(lastReadTimes));
    } catch (error) {
    }

    setCurrentRoom({
      roomId: room.roomId,
      opponentId: room.opponentId,
      opponentUserId: room.opponentUserId,
      otherUserName: room.otherUserName,
      tags: room.tags,
      age: room.age,
      address: room.address,
      gender: room.gender,
    });
    navigate("/chat");
  };

  return (
    <div className={styles["main-container"]}>
      <div className={styles["chat-box"]}>
        <div className={styles["chat-header"]}>
          <p onClick={() => navigate("/main")}>
            <Arrow />
            홈으로 가기
          </p>
        </div>

        <div className={styles["chat-list"]}>
          {rooms.length === 0 ? (
            <div className={styles["empty-state"]}>
              <div className={styles["empty-title"]}>
                아직 채팅방이 없습니다.
                <br />
                랜덤 매칭을 시작해보세요!
              </div>
            </div>
          ) : (
            rooms.map((room) => {
              const isActive = currentRoom?.roomId === room.roomId;
              return (
                <div
                  key={room.roomId}
                  className={`${styles["chat-item"]} ${isActive ? styles["chat-item-active"] : ""}`}
                  onClick={() => handleChatClick(room)}
                >
                  <div className={styles["avatar"]}>
                    <User />
                  </div>
                  <div className={styles["chat-info"]}>
                    <div className={styles["chat-username"]}>
                      {room.otherUserName || `유저 ${room.opponentId}`} <span>@{room.opponentId}</span>
                    </div>
                    <div className={styles["chat-message"]}>
                      {room.lastMessage || "메시지를 보내보세요"}
                    </div>
                  </div>
                  {room.unread && <div className={styles["unread-dot"]}></div>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
