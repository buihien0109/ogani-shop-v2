import { createApi } from "@reduxjs/toolkit/query/react";
import { DOMAIN } from "../../data/constants";
import { baseQueryAuth } from "./baseQuery";

export const favoriteApi = createApi({
    reducerPath: "favoriteApi",
    baseQuery: baseQueryAuth,
    endpoints: (builder) => ({
        getFavoritesByCurrentUser: builder.query({
            query: ({ page, limit }) => {
                return {
                    url: "/favorites",
                    method: "GET",
                    params: { page, limit }
                }
            },
            transformResponse: (response) => {
                return {
                    ...response,
                    content: response.content.map((favorite) => ({
                        ...favorite,
                        product: {
                            ...favorite.product,
                            thumbnail: favorite.product.thumbnail.startsWith("/api")
                                ? `${DOMAIN}${favorite.product.thumbnail}`
                                : favorite.product.thumbnail,
                        }
                    })),
                };
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
    useGetFavoritesByCurrentUserQuery,
    useAddFavoriteMutation,
    useDeleteFavoriteMutation,
    useCheckProductExistsInFavoriteQuery
} = favoriteApi;