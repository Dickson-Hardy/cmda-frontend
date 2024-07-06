import api from "../api";

const chatsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllContacts: build.query({
      query: () => ({ url: "/chats/contacts" }),
      transformResponse: (response) => response.data,
    }),
    getChatHistory: build.query({
      query: (id) => ({ url: `/chats/history/${id}` }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetAllContactsQuery, useGetChatHistoryQuery } = chatsApi;

export default chatsApi;
