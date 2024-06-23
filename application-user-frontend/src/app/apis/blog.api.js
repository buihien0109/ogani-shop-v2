import { createApi } from "@reduxjs/toolkit/query/react";
import { DOMAIN } from "../../data/constants";
import { baseQueryPublic } from "./baseQuery";

export const blogApi = createApi({
    reducerPath: "blogApi",
    baseQuery: baseQueryPublic,
    endpoints: (builder) => ({
        getLatestBlogs: builder.query({
            query: ({ limit }) => {
                return {
                    url: `/blogs/latest-blogs`,
                    method: "GET",
                    params: {
                        limit: limit,
                    },
                };
            },
            transformResponse: (response) => {
                return response.map((blog) => ({
                    ...blog,
                    thumbnail: blog.thumbnail.startsWith("/api") ? `${DOMAIN}${blog.thumbnail}` : blog.thumbnail,
                }));
            }
        }),
        getBlogs: builder.query({
            query: ({ page, limit, search, tag }) => {
                const params = {};
                if (page) params.page = page;
                if (limit) params.limit = limit;
                if (search) params.search = search;
                if (tag) params.tag = tag;
                return {
                    url: `/blogs`,
                    method: "GET",
                    params: params
                }
            },
            transformResponse: (response) => {
                return {
                    ...response,
                    content: response.content.map((blog) => ({
                        ...blog,
                        thumbnail: blog.thumbnail.startsWith("/api") ? `${DOMAIN}${blog.thumbnail}` : blog.thumbnail,
                    })),
                };
            }
        }),
        getBlogDetail: builder.query({
            query: ({ blogId, blogSlug }) => `/blogs/${blogId}/${blogSlug}`,
            transformResponse: (response) => ({
                ...response,
                thumbnail: response.thumbnail.startsWith("/api") ? `${DOMAIN}${response.thumbnail}` : response.thumbnail,
                user: {
                    ...response.user,
                    avatar: response.user.avatar.startsWith("/api") ? `${DOMAIN}${response.user.avatar}` : response.user.avatar,
                }
            })
        }),
        getRecommendBlogs: builder.query({
            query: ({ blogId, limit }) => {
                return {
                    url: `/blogs/${blogId}/recommend-blogs`,
                    method: "GET",
                    params: {
                        limit
                    },
                };
            },
            transformResponse: (response) => {
                return response.map((blog) => ({
                    ...blog,
                    thumbnail: blog.thumbnail.startsWith("/api") ? `${DOMAIN}${blog.thumbnail}` : blog.thumbnail,
                }));
            }
        }),
    })
});

export const {
    useGetLatestBlogsQuery,
    useGetBlogsQuery,
    useGetBlogDetailQuery,
    useGetRecommendBlogsQuery
} = blogApi;
