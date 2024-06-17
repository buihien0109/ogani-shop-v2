import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryUser } from "./baseQuery";

export const userAddressApi = createApi({
    reducerPath: "userAddressApi",
    baseQuery: baseQueryUser,
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
        }),
    }),
});

export const {
    useGetAddressesByUserQuery,
} = userAddressApi;
