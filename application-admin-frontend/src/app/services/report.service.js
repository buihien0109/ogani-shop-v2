import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const reportApi = createApi({
    reducerPath: "reportApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getReportData: builder.query({
            query: ({ start, end }) => {
                let params = {};
                if (start) {
                    params.start = start;
                }
                if (end) {
                    params.end = end;
                }
                return {
                    url: `/reports`,
                    method: "GET",
                    params: params,
                };
            }
        }),
        exportData: builder.query({
            query: ({ start, end, type }) => {
                let params = {};
                if (start) {
                    params.start = start;
                }
                if (end) {
                    params.end = end;
                }
                if (type) {
                    params.type = type;
                }
                return {
                    url: `/reports/export`,
                    method: "GET",
                    params: params,
                    responseHandler: "blob"
                };
            }
        }),
    }),

});

export const {
    useGetReportDataQuery,
    useLazyExportDataQuery,
} = reportApi;
