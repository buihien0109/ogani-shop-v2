import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAuth } from "./baseQuery";
import { DOMAIN } from "../../data/constants";

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: baseQueryAuth,
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => `/carts`,
            transformResponse: (response) => {
                return {
                    ...response,
                    cartItems: response.cartItems.map(cartItem => {
                        return {
                            ...cartItem,
                            product: {
                                ...cartItem.product,
                                thumbnail: cartItem.product.thumbnail.startsWith("/api")
                                    ? `${DOMAIN}${cartItem.product.thumbnail}`
                                    : cartItem.product.thumbnail,
                            }
                        }
                    })
                }
            },
            providesTags: ["Cart"]
        }),
        addToCart: builder.mutation({
            query: (data) => ({
                url: `/carts`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ["Cart"]
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation
} = cartApi;