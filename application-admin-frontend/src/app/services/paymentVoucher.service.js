import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const paymentVoucherApi = createApi({
    reducerPath: "paymentVoucherApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getPaymentVouchers: builder.query({
            query: () => "/payment-vouchers",
            providesTags: ["PaymentVoucher"],
        }),
        getPaymentVoucherById: builder.query({
            query: (id) => `/payment-vouchers/${id}`,
            providesTags: (result, error, id) => [
                { type: "PaymentVoucher", id: id },
            ],
        }),
        createPaymentVoucher: builder.mutation({
            query: (data) => ({
                url: "/payment-vouchers",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PaymentVoucher"],
        }),
        updatePaymentVoucher: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/payment-vouchers/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "PaymentVoucher", id: id },
            ],
        }),
        deletePaymentVoucher: builder.mutation({
            query: (id) => ({
                url: `/payment-vouchers/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PaymentVoucher"],
        }),
    }),
});

export const {
    useGetPaymentVouchersQuery,
    useGetPaymentVoucherByIdQuery,
    useCreatePaymentVoucherMutation,
    useUpdatePaymentVoucherMutation,
    useDeletePaymentVoucherMutation,
} = paymentVoucherApi;
