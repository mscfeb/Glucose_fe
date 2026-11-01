import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { Mutex } from "async-mutex";

import { setCredentials, logout } from "../features/auth/authSlice";

const mutex = new Mutex();

const baseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(
    args,
    api,
    extraOptions
  );

  const excludedEndpoints = [
    "login",
    "register",
    "restoreSession",
  ];

  const shouldRefresh =
    result.error?.status === 401 &&
    !excludedEndpoints.includes(api.endpoint);

  if (shouldRefresh) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await rawBaseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
          },
          api,
          extraOptions
        );

        const refreshedData =
          refreshResult.data?.data ?? refreshResult.data;

        const newAccessToken = refreshedData?.accessToken;

        if (newAccessToken) {
          api.dispatch(
            setCredentials({
              accessToken: newAccessToken,
              user: refreshedData.user ?? api.getState().auth.user,
            })
          );

          result = await rawBaseQuery(
            args,
            api,
            extraOptions
          );
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();

      if (api.getState().auth.accessToken) {
        result = await rawBaseQuery(
          args,
          api,
          extraOptions
        );
      } else {
        api.dispatch(logout());
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "User",
    "Reading",
    "Report",
  ],

  endpoints: () => ({}),
});