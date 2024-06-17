import { createApi } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN } from "../../data/constants";
import { baseQuery } from "./baseQuery";

export const imageApi = createApi({
    reducerPath: "imageApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getImages: builder.query({
            query: () => "/images",
            transformResponse: (response) => {
                return response.map((image) => ({
                    ...image,
                    url: image.url.startsWith("/api") ? `${API_DOMAIN}${image.url}` : image.url,
                }));
            }
        }),
        uploadImage: builder.mutation({
            query: (formData) => ({
                url: "/images",
                method: "POST",
                body: formData,
            }),
            transformResponse: (response) => {
                return {
                    ...response,
                    url: response.url.startsWith("/api") ? `${API_DOMAIN}${response.url}` : response.url,
                };
            },
        }),
        deleteImage: builder.mutation({
            query: (imageId) => ({
                url: `/images/${imageId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetImagesQuery,
    useUploadImageMutation,
    useDeleteImageMutation,
} = imageApi;
