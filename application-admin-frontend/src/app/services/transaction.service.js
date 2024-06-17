import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const transactionApi = createApi({
    reducerPath: "transactionApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getTransactions: builder.query({
            query: () => "/transactions",
            providesTags: ["Transaction"],
        }),
        getTransactionById: builder.query({
            query: (id) => `/transactions/${id}`,
            providesTags: (result, error, id) => [
                { type: "Transaction", id: id },
            ],
        }),
        createTransaction: builder.mutation({
            query: (data) => ({
                url: "/transactions",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Transaction"],
        }),
        updateTransaction: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/transactions/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Transaction", id: id },
            ],
        }),
        deleteTransaction: builder.mutation({
            query: (id) => ({
                url: `/transactions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Transaction"],
        }),
        createTransactionItem: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/transactions/${id}/items`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Transaction", id: id },
            ],
        }),
        updateTransactionItem: builder.mutation({
            query: ({ id, itemId, ...data }) => ({
                url: `/transactions/${id}/items/${itemId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Transaction", id: id },
            ],
        }),
        deleteTransactionItem: builder.mutation({
            query: ({ id, itemId }) => ({
                url: `/transactions/${id}/items/${itemId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Transaction", id: id },
            ],
        }),
    }),
});

export const {
    useGetTransactionsQuery,
    useGetTransactionByIdQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation,
    useCreateTransactionItemMutation,
    useUpdateTransactionItemMutation,
    useDeleteTransactionItemMutation,
} = transactionApi;
