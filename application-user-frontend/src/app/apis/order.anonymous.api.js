import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryPublic } from "./baseQuery";

export const orderAnonymousApi = createApi({
    reducerPath: "orderAnonymousApi",
    baseQuery: baseQueryPublic,
    endpoints: (builder) => ({
        createOrderByAnonymousCustomer: builder.mutation({
            query: (data) => ({
                url: `/orders`,
                method: 'POST',
                body: data
            }),
        }),
        getOrderById: builder.query({
            query: (orderId) => `/orders/${orderId}`,
        }),
    }),
});

export const {
    useCreateOrderByAnonymousCustomerMutation,
    useGetOrderByIdQuery
} = orderAnonymousApi;