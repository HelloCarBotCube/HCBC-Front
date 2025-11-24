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
      if (onConnected) onConnected();
      return;
    }

    const authToken = token || getAccessToken();

    if (!authToken) {
      if (onError) onError(new Error('No token provided'));
      return;
    }

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
        if (onConnected) onConnected();
      },
      onStompError: (frame) => {
        this.connected = false;
        if (onError) onError(frame);
      },
      onWebSocketClose: () => {
        this.connected = false;
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
      return;
    }

    if (!this.client.connected) {
      let attempts = 0;
      const maxAttempts = 50;
      const checkConnection = setInterval(() => {
        attempts++;
        if (this.client.connected) {
          clearInterval(checkConnection);
          this.subscribeToRoom(roomId, onMessageReceived);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkConnection);
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
    } catch (error) {
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
      return;
    }

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
    } catch (error) {
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
