import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAuth } from "./baseQuery";

export const cartItemApi = createApi({
    reducerPath: "cartItemApi",
    baseQuery: baseQueryAuth,
    endpoints: (builder) => ({
        changeQuantityCartItemByProductId: builder.mutation({
            query: ({ productId, ...data }) => ({
                url: `/cart-items`,
                method: 'PUT',
                body: data,
                params: {
                    productId
                },
            }),
        }),
        changeQuantityCartItemById: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/cart-items/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteCartItem: builder.mutation({
            query: (id) => ({
                url: `/cart-items/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useChangeQuantityCartItemByProductIdMutation,
    useChangeQuantityCartItemByIdMutation,
    useDeleteCartItemMutation
} = cartItemApi;