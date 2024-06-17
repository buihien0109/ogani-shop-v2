import { createApi } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN } from "../../data/constants";
import { baseQuery } from "./baseQuery";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => "/products",
            providesTags: ["Product"],
        }),
        getProductById: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [
                { type: "Product", id: id },
            ],
            transformResponse: (response) => {
                return {
                    ...response,
                    thumbnail: response.thumbnail.startsWith("/api") ? `${API_DOMAIN}${response.thumbnail}` : response.thumbnail,
                    subImages: response.subImages ? response.subImages.map((image) => {
                        return image.startsWith("/api") ? `${API_DOMAIN}${image}` : image;
                    }) : [],
                }
            },
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: "/products",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Product", id: id },
            ],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
        getReviewsByProduct: builder.query({
            query: (id) => `/products/${id}/reviews`,
        }),
        updateImage: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/products/${id}/images/update`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Product", id: id },
            ],
        }),
        updateProductQuantity: builder.mutation({
            query: (data) => ({
                url: `/products/update-quantity`,
                method: "PUT",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetReviewsByProductQuery,
    useUpdateImageMutation,
    useUpdateProductQuantityMutation,
} = productApi;
