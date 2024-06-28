import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryPublic } from "./baseQuery";

export const couponApi = createApi({
    reducerPath: "couponApi",
    baseQuery: baseQueryPublic,
    endpoints: (builder) => ({
        checkCouponValid: builder.query({
            query: (code) => `coupons/${code}/check`
        }),
    }),
});

export const {
    useLazyCheckCouponValidQuery
} = couponApi;