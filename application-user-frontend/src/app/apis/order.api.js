import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAuth } from "./baseQuery";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: baseQueryAuth,
    endpoints: (builder) => ({
        getOrdersByCurrentUser: builder.query({
            query: () => `/orders`,
            providesTags: ['Order']
        }),
        createOrderByCustomer: builder.mutation({
            query: (data) => ({
                url: `/orders`,
                method: 'POST',
                body: data
            }),
        }),
        cancelOrderByCustomer: builder.mutation({
            query: (orderId) => ({
                url: `/orders/${orderId}/cancel`,
                method: 'PUT',
            }),
            invalidatesTags: ['Order']
        }),
    }),
});

export const {
    useGetOrdersByCurrentUserQuery,
    useCreateOrderByCustomerMutation,
    useCancelOrderByCustomerMutation
} = orderApi;