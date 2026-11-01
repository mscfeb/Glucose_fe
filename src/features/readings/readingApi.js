import { baseApi } from "../../services/baseApi";

export const readingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReadings: builder.query({
      query: ({ page = 1, limit = 20, date } = {}) => ({
        url: "/readings",
        params: {
          page,
          limit,
          ...(date ? { date } : {}),
        },
      }),

      providesTags: (result) => [
        { type: "Reading", id: "LIST" },
        ...(result?.data?.readings ?? result?.readings ?? []).map(
          ({ id }) => ({ type: "Reading", id })
        ),
      ],
    }),

    getReadingSlots: builder.query({
      query: () => "/readings/slots",
    }),

    createReading: builder.mutation({
      query: (body) => ({
        url: "/readings",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        { type: "Reading", id: "LIST" },
        "Report",
      ],
    }),

    updateReading: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/readings/${id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: [
        { type: "Reading", id: "LIST" },
        "Report",
      ],
    }),

    deleteReading: builder.mutation({
      query: (id) => ({
        url: `/readings/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [
        { type: "Reading", id: "LIST" },
        "Report",
      ],
    }),
  }),
});

export const {
  useGetReadingsQuery,
  useGetReadingSlotsQuery,
  useCreateReadingMutation,
  useUpdateReadingMutation,
  useDeleteReadingMutation,
} = readingApi;