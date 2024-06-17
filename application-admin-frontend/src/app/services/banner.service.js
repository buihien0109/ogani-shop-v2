import { createApi } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN } from "../../data/constants";
import { baseQuery } from "./baseQuery";

export const bannerApi = createApi({
    reducerPath: "bannerApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getBanners: builder.query({
            query: () => "/banners",
            providesTags: ["Banner"],
        }),
        getBannersActive: builder.query({
            query: () => "/banners/active",
            providesTags: ["Banner"],
        }),
        getBannerById: builder.query({
            query: (id) => `/banners/${id}`,
            providesTags: (result, error, id) => [
                { type: "Banner", id: id },
            ],
            transformResponse: (response) => {
                return {
                    ...response,
                    thumbnail: response.thumbnail.startsWith("/api")
                        ? `${API_DOMAIN}${response.thumbnail}`
                        : response.thumbnail,
                };
            }
        }),
        createBanner: builder.mutation({
            query: (data) => ({
                url: "/banners",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Banner"],
        }),
        updateBanner: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/banners/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Banner", id: id },
            ],
        }),
        deleteBanner: builder.mutation({
            query: (id) => ({
                url: `/banners/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Banner"],
        }),
        sortBanners: builder.mutation({
            query: (data) => ({
                url: "/banners/sort",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Banner"],
        }),
    }),
});

export const {
    useGetBannersQuery,
    useGetBannersActiveQuery,
    useGetBannerByIdQuery,
    useCreateBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
    useSortBannersMutation,
} = bannerApi;
