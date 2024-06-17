import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        updateReview: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/reviews/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
        deleteReview: builder.mutation({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: "DELETE",
            })
        }),
    }),
});

export const {
    useUpdateReviewMutation,
    useDeleteReviewMutation,
} = reviewApi;
