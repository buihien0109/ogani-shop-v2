import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const productAttributeApi = createApi({
    reducerPath: "productAttributeApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getAttributesByProduct: builder.query({
            query: (productId) => {
                return {
                    url: `/attributes`,
                    method: "GET",
                    params: {
                        productId: productId,
                    },
                };
            },
            providesTags: ["Attribute"],
        }),
        createAttribute: builder.mutation({
            query: (data) => ({
                url: `/attributes`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Attribute"],
        }),
        updateAttribute: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/attributes/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Attribute"],
        }),
        deleteAttribute: builder.mutation({
            query: (id) => ({
                url: `/attributes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Attribute"],
        }),
    }),
});

export const {
    useGetAttributesByProductQuery,
    useCreateAttributeMutation,
    useUpdateAttributeMutation,
    useDeleteAttributeMutation,
} = productAttributeApi;
