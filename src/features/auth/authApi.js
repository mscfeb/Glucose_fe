import { baseApi } from "../../services/baseApi";

import {
  setCredentials,
  setUser,
  logout,
  setAuthInitialized,
} from "./authSlice";

function getPayload(response) {
  return response?.data ?? response;
}

function getAuthData(response) {
  const payload = getPayload(response);

  return {
    accessToken: payload?.accessToken,
    user: payload?.user ?? null,
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const authData = getAuthData(data);

          if (authData.accessToken) {
            dispatch(setCredentials(authData));
          }
        } catch {
          // Login errors are handled by the login component.
        }
      },
    }),

    restoreSession: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const authData = getAuthData(data);

          if (!authData.accessToken) {
            dispatch(logout());
            return;
          }

          dispatch(setCredentials(authData));
        } catch {
          dispatch(setAuthInitialized());
        }
      },
    }),

    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),

      transformResponse: (response) => {
        const payload = getPayload(response);
        return payload?.user ?? payload;
      },

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // The API layer handles authentication failures.
        }
      },

      providesTags: ["User"],
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // Local logout must still happen if the server is unavailable.
        } finally {
          dispatch(logout());
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRestoreSessionMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutUserMutation,
} = authApi;