import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAuth } from "./baseQuery";

export const userAddressApi = createApi({
    reducerPath: "userAddressApi",
    baseQuery: baseQueryAuth,
    endpoints: (builder) => ({
        getAddressesByUser: builder.query({
            query: (userId) => {
                const params = {};
                if (userId) {
                    params.userId = userId;
                }
                return {
                    url: `/user-address`,
                    method: "GET",
                    params
                }
            },
            providesTags: ["UserAddress"],
        }),
        createUserAddress: builder.mutation({
            query: (data) => ({
                url: `/user-address`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["UserAddress"],
        }),
        updateUserAddress: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/user-address/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["UserAddress"],
        }),
        setDefaultUserAddress: builder.mutation({
            query: (id) => ({
                url: `/user-address/${id}/set-default`,
                method: "PUT"
            }),
            invalidatesTags: ["UserAddress"],
        }),
        deleteUserAddress: builder.mutation({
            query: (id) => ({
                url: `/user-address/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["UserAddress"],
        }),
    }),
});

export const {
    useGetAddressesByUserQuery,
    useCreateUserAddressMutation,
    useUpdateUserAddressMutation,
    useSetDefaultUserAddressMutation,
    useDeleteUserAddressMutation
} = userAddressApi;
