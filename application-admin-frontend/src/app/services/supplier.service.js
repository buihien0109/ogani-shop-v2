import { createApi } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN } from "../../data/constants";
import { baseQuery } from "./baseQuery";

export const supplierApi = createApi({
    reducerPath: "supplierApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getSuppliers: builder.query({
            query: () => "/suppliers",
            providesTags: ["Supplier"],
            transformResponse: (response) => {
                return response.map((item) => {
                    return {
                        ...item,
                        thumbnail: item.thumbnail.startsWith("/api")
                            ? `${API_DOMAIN}${item.thumbnail}`
                            : item.thumbnail,
                    };
                });
            }
        }),
        getSupplierById: builder.query({
            query: (id) => `/suppliers/${id}`,
            providesTags: (result, error, id) => [
                { type: "Supplier", id: id },
            ],
            transformResponse: (response) => {
                return {
                    ...response,
                    thumbnail: response.thumbnail.startsWith("/api")
                        ? `${API_DOMAIN}${response.thumbnail}`
                        : response.thumbnail,
                };
            }
        }),
        createSupplier: builder.mutation({
            query: (data) => ({
                url: "/suppliers",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Supplier"],
        }),
        updateSupplier: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/suppliers/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Supplier", id: id },
            ],
        }),
        deleteSupplier: builder.mutation({
            query: (id) => ({
                url: `/suppliers/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Supplier"],
        }),
        getTransactionsBySupplier: builder.query({
            query: (id) => `/suppliers/${id}/transactions`,
        }),
    }),
});

export const {
    useGetSuppliersQuery,
    useGetSupplierByIdQuery,
    useCreateSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation,
    useGetTransactionsBySupplierQuery,
} = supplierApi;
