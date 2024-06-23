import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryPublic } from "./baseQuery";

export const addressApi = createApi({
    reducerPath: "addressApi",
    baseQuery: baseQueryPublic,
    endpoints: (builder) => ({
        getAddress: builder.query({
            query: ({ provinceCode, districtCode, wardCode }) => {
                return {
                    url: "/address",
                    method: 'GET',
                    params: {
                        provinceCode,
                        districtCode,
                        wardCode,
                    }
                }
            }
        }),
        getProvinces: builder.query({
            query: () => '/address/provinces',
        }),
        getProvinceByCode: builder.query({
            query: (provinceCode) => `/address/provinces/${provinceCode}`,
        }),
        getDistricts: builder.query({
            query: (provinceCode) => {
                const params = {};
                if (provinceCode) {
                    params.provinceCode = provinceCode;
                }
                return {
                    url: `/address/districts`,
                    method: 'GET',
                    params,
                }

            },
        }),
        getDistrictByCode: builder.query({
            query: (districtCode) => `/address/districts/${districtCode}`,
        }),
        getWards: builder.query({
            query: (districtCode) => {
                const params = {};
                if (districtCode) {
                    params.districtCode = districtCode;
                }
                return {
                    url: `/address/wards`,
                    method: 'GET',
                    params,
                }

            },
        }),
    }),
});

export const {
    useGetAddressQuery,
    useGetProvincesQuery,
    useGetProvinceByCodeQuery,
    useGetDistrictsQuery,
    useGetDistrictByCodeQuery,
    useGetWardsQuery,
} = addressApi;
