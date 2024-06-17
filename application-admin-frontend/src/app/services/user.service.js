import { createApi } from "@reduxjs/toolkit/query/react";
import { API_DOMAIN } from "../../data/constants";
import { baseQuery } from "./baseQuery";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => "/users",
            providesTags: ["User"],
            transformResponse: (response) => {
                return response.map((item) => {
                    return {
                        ...item,
                        avatar: item.avatar.startsWith("/api")
                            ? `${API_DOMAIN}${item.avatar}`
                            : item.avatar,
                    };
                });
            }
        }),
        getUserById: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: "User", id: id }],
            transformResponse: (response) => {
                return {
                    ...response,
                    avatar: response.avatar.startsWith("/api")
                        ? `${API_DOMAIN}${response.avatar}`
                        : response.avatar,
                };
            }
        }),
        createUser: builder.mutation({
            query: (newUser) => ({
                url: "/users",
                method: "POST",
                body: newUser,
            }),
            invalidatesTags: [{ type: "User" }],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...updatedUser }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: updatedUser,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "User", id: id },
            ],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "User" }],
        }),
        resetPassword: builder.mutation({
            query: (id) => ({
                url: `/users/${id}/reset-password`,
                method: "POST",
            }),
        }),
        getOrdersByUser: builder.query({
            query: (id) => `/users/${id}/orders`,
        }),
        getUsersByEnabled: builder.query({
            query: (enabled) => {
                return {
                    url: `/users/get-by-enabled`,
                    method: "GET",
                    params: {
                        enabled,
                    },
                }
            },
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useResetPasswordMutation,
    useGetOrdersByUserQuery,
    useGetUsersByEnabledQuery,
} = userApi;
