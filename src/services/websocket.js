import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAccessToken } from '../utils/cookies';

const WS_BASE_URL = 'http://gsmsv-1.yujun.kr:27919';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.currentRoomId = null;
    this.subscriptions = {};
    this.sentMessages = new Set();
  }

  connect(token, onConnected, onError) {
    if (this.connected && this.client?.connected) {
      console.log('이미 WebSocket 연결됨');
      if (onConnected) onConnected();
      return;
    }

    const authToken = token || getAccessToken();

    if (!authToken) {
      console.error('토큰이 없습니다');
      if (onError) onError(new Error('No token provided'));
      return;
    }

    console.log('WebSocket 연결 시작');

    const socket = new SockJS(`${WS_BASE_URL}/ws-stomp`);

    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${authToken}`,
        token: authToken,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.connected = true;
        console.log('WebSocket 연결 성공');
        if (onConnected) onConnected();
      },
      onStompError: (frame) => {
        this.connected = false;
        console.error('STOMP 오류:', frame);
        if (onError) onError(frame);
      },
      onWebSocketClose: () => {
        this.connected = false;
        console.warn('WebSocket 연결 종료');
      },
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      this.subscriptions = {};
    }
  }

  subscribeToRoom(roomId, onMessageReceived) {
    if (!this.client) {
      console.error('WebSocket 클라이언트가 초기화되지 않았습니다');
      return;
    }

    if (!this.connected) {
      console.log('WebSocket 연결 대기 중');
      let attempts = 0;
      const maxAttempts = 50;
      const checkConnection = setInterval(() => {
        attempts++;
        if (this.connected) {
          clearInterval(checkConnection);
          this.subscribeToRoom(roomId, onMessageReceived);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkConnection);
          console.error('WebSocket 연결 타임아웃 - 구독 실패');
        }
      }, 100);
      return;
    }

    if (this.subscriptions[roomId]) {
      this.subscriptions[roomId].unsubscribe();
    }

    try {
      this.subscriptions[roomId] = this.client.subscribe(`/topic/room/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        if (onMessageReceived) {
          onMessageReceived(data);
        }
      });

      this.currentRoomId = roomId;
      console.log('채팅방 구독 완료:', roomId);
    } catch (error) {
      console.error('채팅방 구독 실패:', error);
    }
  }

  unsubscribeFromRoom(roomId) {
    if (this.subscriptions[roomId]) {
      this.subscriptions[roomId].unsubscribe();
      delete this.subscriptions[roomId];
    }
  }

  sendMessage(roomId, content) {
    if (!this.connected || !this.client) {
      console.error('WebSocket 연결 안 됨 - 메시지 전송 불가');
      return;
    }

    console.log('메시지 전송:', { roomId, content });

    const messageKey = `${roomId}-${content}-${Date.now()}`;
    this.sentMessages.add(messageKey);

    setTimeout(() => {
      this.sentMessages.delete(messageKey);
    }, 3000);

    try {
      this.client.publish({
        destination: `/app/room/${roomId}/send`,
        body: JSON.stringify({
          roomId,
          content,
        }),
      });
      console.log('메시지 전송 완료');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  }

  isMyMessage(roomId, content) {
    return Array.from(this.sentMessages).some((key) => key.startsWith(`${roomId}-${content}-`));
  }

  leaveRoom(roomId) {
    if (!this.connected || !this.client) {
      return;
    }

    this.client.publish({
      destination: `/app/room/${roomId}/leave`,
      body: JSON.stringify({ roomId }),
    });

    this.unsubscribeFromRoom(roomId);
  }

  isConnected() {
    return this.connected;
  }
}

const websocketService = new WebSocketService();

export default websocketService;
