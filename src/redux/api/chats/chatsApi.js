import api from "../api";

const chatsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllChats: build.query({
      query: ({ searchText, sender, receiver, room }) => ({
        url: "/chats",
        params: {
          limit: 50,
          ...(searchText ? { searchText } : {}),
          ...(sender ? { sender } : {}),
          ...(receiver ? { receiver } : {}),
          ...(room ? { room } : {}),
        },
      }),
    }),
    getChatsHistory: build.query({
      query: ({ searchText }) => ({
        url: "/chats/history",
        params: {
          limit: 50,
          ...(searchText ? { searchText } : {}),
        },
      }),
    }),
    addToHistory: build.mutation({
      query: (payload) => ({ url: `/chats/add-to-history`, method: "POST", body: payload }),
      transformErrorResponse: (response) => response.data?.message,
    }),
  }),
});

export const { useGetAllChatsQuery, useGetChatsHistoryQuery, useAddToHistoryMutation } = chatsApi;

export default chatsApi;
