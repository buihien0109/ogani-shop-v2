import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAuth, baseQueryPublic } from "./baseQuery";

export const reviewAnonymousApi = createApi({
    reducerPath: "reviewAnonymousApi",
    baseQuery: baseQueryPublic,
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
    }),
});

export const {
    useCreateReviewMutation
} = reviewAnonymousApi;