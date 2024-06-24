import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAuth } from "./baseQuery";

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: baseQueryAuth,
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => `/carts`
        }),
        addToCart: builder.mutation({
            query: (data) => ({
                url: `/carts`,
                method: 'POST',
                body: data
            }),
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation
} = cartApi;