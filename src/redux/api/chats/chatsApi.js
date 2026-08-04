import api from "../api";

const chatsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllContacts: build.query({
      query: () => ({ url: "/chats/contacts" }),
      transformResponse: (response) => response.data,
      providesTags: ["ALL_CONTACTS"],
    }),
    getChatHistory: build.query({
      query: ({ id, page = 1, limit = 50 }) => ({
        url: `/chats/history/${id}`,
        params: { page, limit },
      }),
      transformResponse: (response) => response.data,
      // Merge pages when loading more
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.id}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          messages: [...newItems.messages, ...currentCache.messages],
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      invalidatesTags: ["ALL_CONTACTS"],
    }),
    sendMessage: build.mutation({
      query: (body) => ({ url: "/chats/messages", method: "POST", body }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["ALL_CONTACTS"],
    }),
  }),
});

export const { useGetAllContactsQuery, useGetChatHistoryQuery, useSendMessageMutation } = chatsApi;

export default chatsApi;
