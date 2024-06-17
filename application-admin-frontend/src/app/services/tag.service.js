import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const tagApi = createApi({
    reducerPath: "tagApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getTags: builder.query({
            query: () => '/tags',
            providesTags: ['Tag'],
        }),
        getTagById: builder.query({
            query: (id) => `/tags/${id}`,
        }),
        createTag: builder.mutation({
            query: (data) => ({
                url: '/tags',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Tag' }],
        }),
        updateTag: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/tags/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: [{ type: 'Tag' }],
        }),
        deleteTag: builder.mutation({
            query: (id) => ({
                url: `/tags/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Tag' }],
        }),
        getAllBlogsByTagId: builder.query({
            query: (id) => `/tags/${id}/blogs`,
        }),
    }),
});

export const {
    useGetTagsQuery,
    useGetTagByIdQuery,
    useCreateTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation,
    useLazyGetAllBlogsByTagIdQuery,
    useGetAllBlogsByTagIdQuery
} = tagApi;
