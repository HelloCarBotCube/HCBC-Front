import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../store/useChatStore';
import { getChatRooms } from '../services/chatApi';
import styles from './ChatList.module.css';
import User from '../assets/user';
import Arrow from '../assets/arrow';

export default function Main() {
  const navigate = useNavigate();
  const { rooms, setRooms, setCurrentRoom, currentRoom } = useChatStore();

  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        const data = await getChatRooms(50);

        const uniqueChats = {};
        (Array.isArray(data) ? data : []).forEach((chat) => {
          const key = chat.opponentUserId;
          if (
            !uniqueChats[key] ||
            new Date(chat.lastActiveAt) > new Date(uniqueChats[key].lastActiveAt)
          ) {
            uniqueChats[key] = chat;
          }
        });

        const mappedRooms = Object.values(uniqueChats).map((chat) => {
          return {
            roomId: chat.roomId,
            opponentId: chat.opponentLoginId,
            opponentUserId: chat.opponentUserId,
            otherUserName: chat.opponentName || '알 수 없는 사용자',
            lastMessage: chat.lastMessage || '메시지 없음',
            lastActiveAt: chat.lastActiveAt,
            tags: [],
            age: null,
            address: null,
            gender: null,
            unread: false,
          };
        });

        setRooms(mappedRooms);
        if (currentRoom?.roomId) {
          const restoredRoom = mappedRooms.find((room) => room.roomId === currentRoom.roomId);
          if (restoredRoom) {
            setCurrentRoom(restoredRoom);
          }
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('채팅방 목록 불러오기 실패:', error.message);
        }
      }
    };

    loadChatRooms();
  }, [setRooms, setCurrentRoom, currentRoom?.roomId]);

  const handleChatClick = (room) => {
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
          {rooms.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#999',
              }}
            >
              아직 채팅방이 없습니다.
              <br />
              랜덤 매칭을 시작해보세요!
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.roomId}
                className={styles['chat-item']}
                onClick={() => handleChatClick(room)}
              >
                <div className={styles['profile']}>
                  <div className={styles['avatar']}>
                    <User />
                  </div>
                </div>
                <div className={styles['chat-info']}>
                  <div className={styles['chat-username']}>
                    {room.otherUserName || `유저 ${room.opponentId}`}
                    <span className={styles['chat-username-span']}>@{room.opponentId}</span>
                  </div>
                  <div className={styles['chat-message']}>
                    {room.lastMessage || '메시지를 보내보세요'}
                  </div>
                </div>
                {room.unread && <div className={styles['unread-dot']}></div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
