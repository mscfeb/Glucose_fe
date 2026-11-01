import { baseApi } from "../../services/baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDailyReport: builder.query({
      query: (date) => ({
        url: "/reports/daily",
        params: { date },
      }),

      providesTags: ["Report"],
    }),

    getMonthToDateReport: builder.query({
      query: () => "/reports/month-to-date",

      providesTags: ["Report"],
    }),

    getPreviousMonthReport: builder.query({
      query: () => "/reports/previous-month",

      providesTags: ["Report"],
    }),
  }),
});

export const {
  useGetDailyReportQuery,
  useGetMonthToDateReportQuery,
  useGetPreviousMonthReportQuery,
} = reportApi;