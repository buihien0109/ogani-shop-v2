import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryPublic } from "./baseQuery";

export const tagApi = createApi({
    reducerPath: "tagApi",
    baseQuery: baseQueryPublic,
    endpoints: (builder) => ({
        getTags: builder.query({
            query: () => "/tags"
        }),
        getTagBySlug: builder.query({
            query: (slug) => `/tags/${slug}`
        })
    }),
});

export const {
    useGetTagsQuery,
    useGetTagBySlugQuery
} = tagApi;
