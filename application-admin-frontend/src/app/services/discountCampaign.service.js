import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const discountCampaignApi = createApi({
    reducerPath: "discountCampaignApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getDiscountCampaigns: builder.query({
            query: () => "/discount-campaigns",
            providesTags: ["DiscountCampaign"],
        }),
        getDiscountCampaignById: builder.query({
            query: (id) => `/discount-campaigns/${id}`,
            providesTags: (result, error, id) => [{ type: "DiscountCampaign", id: id }],
        }),
        createDiscountCampaign: builder.mutation({
            query: (data) => ({
                url: "/discount-campaigns",
                method: "POST",
                body: data,
            }),
            invalidatesTags: [{ type: "DiscountCampaign" }],
        }),
        updateDiscountCampaign: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/discount-campaigns/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "DiscountCampaign", id: id },
            ],
        }),
        deleteDiscountCampaign: builder.mutation({
            query: (id) => ({
                url: `/discount-campaigns/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "DiscountCampaign" }],
        }),
    }),
});

export const {
    useGetDiscountCampaignsQuery,
    useGetDiscountCampaignByIdQuery,
    useCreateDiscountCampaignMutation,
    useUpdateDiscountCampaignMutation,
    useDeleteDiscountCampaignMutation,
} = discountCampaignApi;
