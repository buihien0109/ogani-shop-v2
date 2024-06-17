import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const roleApi = createApi({
    reducerPath: "roleApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getRoles: builder.query({
            query: () => '/roles'
        }),
    }),
});

export const {
    useGetRolesQuery
} = roleApi;
