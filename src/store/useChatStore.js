import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set) => ({
      rooms: [],
      currentRoom: null,
      roomMessages: {},
      messages: [],

      setRooms: (rooms) => set({ rooms }),

      setCurrentRoom: (room) =>
        set((state) => ({
          currentRoom: room,
          messages: room ? state.roomMessages[room.roomId] || [] : [],
        })),

      addMessage: (message) =>
        set((state) => {
          if (!state.currentRoom) return state;

          const roomId = state.currentRoom.roomId;
          const updatedRoomMessages = {
            ...state.roomMessages,
            [roomId]: [...(state.roomMessages[roomId] || []), message],
          };

          return {
            roomMessages: updatedRoomMessages,
            messages: updatedRoomMessages[roomId],
          };
        }),

      setMessages: (messages) =>
        set((state) => {
          if (!state.currentRoom) return state;

          const roomId = state.currentRoom.roomId;
          return {
            roomMessages: {
              ...state.roomMessages,
              [roomId]: messages,
            },
            messages,
          };
        }),

      leaveRoom: () => set({ currentRoom: null, messages: [] }),

      removeRoom: (roomId) =>
        set((state) => {
          const newRoomMessages = { ...state.roomMessages };
          delete newRoomMessages[roomId];

          return {
            rooms: state.rooms.filter((room) => room.roomId !== roomId),
            roomMessages: newRoomMessages,
          };
        }),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        roomMessages: state.roomMessages,
        currentRoom: state.currentRoom,
      }),
    }
  )
);

export default useChatStore;
