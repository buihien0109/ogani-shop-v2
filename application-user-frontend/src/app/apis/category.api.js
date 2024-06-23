import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryPublic } from "./baseQuery";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: baseQueryPublic,
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/categories'
        }),
        getCategoryById: builder.query({
            query: (id) => `/categories/${id}`
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery
} = categoryApi;
