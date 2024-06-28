import { createApi } from "@reduxjs/toolkit/query/react";
import { DOMAIN } from "../../data/constants";
import { baseQueryAuth } from "./baseQuery";

export const favoriteApi = createApi({
    reducerPath: "favoriteApi",
    baseQuery: baseQueryAuth,
    endpoints: (builder) => ({
        getFavorites: builder.query({
            query: () => {
                return {
                    url: "/favorites",
                    method: "GET"
                }
            },
            transformResponse: (response) => {
                return response.map((favorite) => ({
                    ...favorite.product,
                    thumbnail: favorite.product.thumbnail.startsWith("/api")
                        ? `${DOMAIN}${favorite.product.thumbnail}`
                        : favorite.product.thumbnail,
                    subImages: favorite.product.subImages.map((subImage) => subImage.startsWith("/api") ? `${DOMAIN}${subImage}` : subImage)
                }))
            },
            providesTags: ["Favorite"],
        }),
        addFavorite: builder.mutation({
            query: (data) => {
                return {
                    url: "/favorites",
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ["Favorite"]
        }),
        deleteFavorite: builder.mutation({
            query: (productId) => {
                return {
                    url: `/favorites`,
                    method: "DELETE",
                    params: { productId }
                }
            },
            invalidatesTags: ["Favorite"]
        }),
        checkProductExistsInFavorite: builder.query({
            query: (productId) => {
                return {
                    url: `/favorites/check-in-favorite`,
                    method: "GET",
                    params: { productId }
                }
            },
        }),
    }),
});

export const {
    useGetFavoritesQuery,
    useAddFavoriteMutation,
    useDeleteFavoriteMutation,
    useCheckProductExistsInFavoriteQuery
} = favoriteApi;