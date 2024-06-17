import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { API_DOMAIN } from "../../data/constants";

export const blogApi = createApi({
    reducerPath: "blogApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getBlogs: builder.query({
            query: () => "/blogs",
            providesTags: ["Blog"],
        }),
        getOwnBlogs: builder.query({
            query: () => "/blogs/own-blogs",
            providesTags: ["Blog"],
        }),
        getBlogById: builder.query({
            query: (id) => `/blogs/${id}`,
            providesTags: (result, error, id) => [
                { type: "Blog", id: id },
            ],
            transformResponse: (response) => {
                return {
                    ...response,
                    thumbnail: response.thumbnail.startsWith("/api")
                        ? `${API_DOMAIN}${response.thumbnail}`
                        : response.thumbnail,
                }
            }
        }),
        createBlog: builder.mutation({
            query: (data) => ({
                url: "/blogs",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Blog"],
        }),
        updateBlog: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/blogs/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Blog", id: id },
            ],
        }),
        deleteBlog: builder.mutation({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blog"],
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetOwnBlogsQuery,
    useGetBlogByIdQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = blogApi;
