import api from "../api";

const eventsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllEvents: build.query({
      query: ({ limit, page, searchBy, eventDate, eventType, membersGroup, fromToday } = {}) => ({
        url: "/events",
        params: {
          limit,
          page,
          ...(searchBy ? { searchBy } : {}),
          ...(eventDate ? { eventDate } : {}),
          ...(eventType ? { eventType } : {}),
          ...(membersGroup ? { membersGroup } : {}),
          ...(fromToday ? { fromToday } : {}),
        },
      }),
      transformResponse: (response) => response.data,
      providesTags: ["EVENTS"],
    }),
    getAllConferences: build.query({
      query: ({
        limit,
        page,
        searchBy,
        eventDate,
        eventType,
        membersGroup,
        fromToday,
        conferenceType,
        zone,
        region,
      } = {}) => ({
        url: "/events/conferences",
        params: {
          limit,
          page,
          ...(searchBy ? { searchBy } : {}),
          ...(eventDate ? { eventDate } : {}),
          ...(eventType ? { eventType } : {}),
          ...(membersGroup ? { membersGroup } : {}),
          ...(fromToday ? { fromToday } : {}),
          ...(conferenceType ? { conferenceType } : {}),
          ...(zone ? { zone } : {}),
          ...(region ? { region } : {}),
        },
      }),
      transformResponse: (response) => response.data,
      providesTags: ["CONFERENCES"],
    }),
    getSingleEvent: build.query({
      query: (slug) => `/events/${slug}`,
      transformResponse: (response) => response.data,
      providesTags: ["SINGLE_EVT"],
    }),
    getAllTrainings: build.query({
      query: ({ searchBy, membersGroup } = {}) => ({
        url: "/trainings",
        params: { ...(searchBy ? { searchBy } : {}), ...(membersGroup ? { membersGroup } : {}) },
      }),
      transformResponse: (response) => response.data,
      providesTags: ["TRAININGS"],
    }),
    getRegisteredEvents: build.query({
      query: ({ limit, page, searchBy } = {}) => ({
        url: "/events/registered",
        params: { limit, page, ...(searchBy ? { searchBy } : {}) },
      }),
      transformResponse: (response) => {
        // Transform the response to match the expected format
        if (response && response.data) {
          // Make sure events is treated as an array even if it's undefined or null
          const events = Array.isArray(response.data.events) ? response.data.events : [];
          return {
            items: events,
            meta: response.data.pagination || { totalPages: 0 },
          };
        }
        return { items: [], meta: { totalPages: 0 } };
      },
      providesTags: ["USER_EVENTS"],
    }),
    registerForEvent: build.mutation({
      query: ({ slug }) => ({ url: `/events/register/${slug}`, method: "POST" }),
      invalidatesTags: ["USER_EVENTS", "SINGLE_EVT"],
    }),
    payForEvent: build.mutation({
      query: ({ slug, paymentMethod, amount, period }) => ({
        url: `/events/pay/${slug}`,
        method: "POST",
        body: { paymentMethod, amount, period },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["USER_EVENTS", "SINGLE_EVT"],
    }),
    confirmEventPayment: build.mutation({
      query: (body) => ({ url: `/events/confirm-payment`, method: "POST", body }),
      invalidatesTags: ["USER_EVENTS", "SINGLE_EVT"],
    }),
    syncEventPaymentStatus: build.mutation({
      query: (body) => ({ url: "/events/sync-payment-status", body, method: "POST" }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["USER_EVENTS", "SINGLE_EVT"],
    }),

    // Public endpoints (no authentication required)
    getPublicConferences: build.query({
      query: ({ limit, page, searchBy, eventType, membersGroup, conferenceType, zone, region } = {}) => ({
        url: "/events/public/conferences", // Fixed: using the correct public endpoint
        params: {
          limit: limit || 10,
          page: page || 1,
          ...(searchBy ? { searchBy } : {}),
          ...(eventType ? { eventType } : {}),
          ...(membersGroup ? { membersGroup } : {}),
          ...(conferenceType ? { conferenceType } : {}),
          ...(zone ? { zone } : {}),
          ...(region ? { region } : {}),
        },
      }),
      transformResponse: (response) => response.data,
      providesTags: ["PUBLIC_CONFERENCES"],
    }),
    checkUserExists: build.mutation({
      query: (email) => {
        console.log("RTK Query checkUserExists called with:", email);

        // Ensure email is a valid string
        let emailValue = email;
        if (typeof email === "object" && email !== null) {
          emailValue = email.email;
        }

        // Validate email format
        if (!emailValue || typeof emailValue !== "string") {
          // Consider throwing a more specific error or returning a rejected promise
          // for the calling code to handle, rather than a generic Error.
          // This allows the UI to give more specific feedback.
          return Promise.reject({
            status: "VALIDATION_ERROR",
            message: "Email is required and must be a string",
          });
        }

        emailValue = emailValue.trim();
        if (emailValue === "") {
          return Promise.reject({
            status: "VALIDATION_ERROR",
            message: "Email cannot be empty",
          });
        }

        console.log("Final email to be sent:", emailValue);

        const requestBody = { email: emailValue };
        console.log("Request body being sent:", requestBody);
        console.log("Request body JSON:", JSON.stringify(requestBody));

        // Log the full URL that will be constructed
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
        const endpointPath = "/events/public/check-user"; // Explicitly define the endpoint
        const fullUrl = `${baseUrl}${endpointPath}`;
        console.log("Full URL being called:", fullUrl);
        console.log("Base URL:", baseUrl);

        return {
          url: endpointPath, // Use the explicit endpointPath here
          method: "POST",
          body: requestBody,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      transformResponse: (response) => {
        console.log("RTK Query response:", response);
        return response.data || response;
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error("RTK Query error response:", response);
        console.error("Error meta:", meta);
        console.error("Error arg:", arg);
        return response;
      },
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetAllConferencesQuery,
  useGetSingleEventQuery,
  useGetAllTrainingsQuery,
  useRegisterForEventMutation,
  useGetRegisteredEventsQuery,
  usePayForEventMutation,
  useConfirmEventPaymentMutation,
  useSyncEventPaymentStatusMutation,
  useGetPublicConferencesQuery,
  useCheckUserExistsMutation,
} = eventsApi;

export default eventsApi;
