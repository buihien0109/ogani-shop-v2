import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: baseQuery,
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/categories',
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Category', id })), { type: 'Category', id: 'LIST' }]
                    : [{ type: 'Category', id: 'LIST' }],
        }),
        getCategoryById: builder.query({
            query: (id) => `/categories/${id}`,
            providesTags: (result, error, id) => [{ type: 'Category', id }],
        }),
        createParentCategory: builder.mutation({
            query: (data) => ({
                url: '/categories/create-parent-category',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        createSubCategory: builder.mutation({
            query: (data) => ({
                url: '/categories/create-sub-category',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Category', id: 'LIST' }],
        }),
        updateParentCategory: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/categories/${id}/update-parent-category`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
        }),
        updateSubCategory: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/categories/${id}/update-sub-category`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Category', id }],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateParentCategoryMutation,
    useCreateSubCategoryMutation,
    useUpdateParentCategoryMutation,
    useUpdateSubCategoryMutation,
    useDeleteCategoryMutation
} = categoryApi;
