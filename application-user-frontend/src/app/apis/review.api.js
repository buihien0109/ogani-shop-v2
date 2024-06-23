import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAuth } from "./baseQuery";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: baseQueryAuth,
    tagTypes: ['Review'],
    endpoints: (builder) => ({
        createReview: builder.mutation({
            query: (data) => {
                return {
                    url: "/reviews",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: [{ type: 'Review', id: 'LIST' }],
        }),
        updateReview: builder.mutation({
            query: ({ id, ...data }) => {
                return {
                    url: `/reviews/${id}`,
                    method: "PUT",
                    body: data
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Review', id }],
        }),
        deleteReview: builder.mutation({
            query: (id) => {
                return {
                    url: `/reviews/${id}`,
                    method: "DELETE"
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Review', id }],
        }),
    }),
});

export const {
    useCreateReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation
} = reviewApi;