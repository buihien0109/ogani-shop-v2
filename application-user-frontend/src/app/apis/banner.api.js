import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryPublic } from "./baseQuery";
import { DOMAIN } from "../../data/constants";

export const bannerApi = createApi({
    reducerPath: "bannerApi",
    baseQuery: baseQueryPublic,
    endpoints: (builder) => ({
        getBanners: builder.query({
            query: () => "/banners",
            providesTags: ["Banner"],
            transformResponse: (response) => response.map((banner) => ({
                ...banner,
                thumbnail: banner.thumbnail.startsWith("/api") ? `${DOMAIN}${banner.thumbnail}` : banner.thumbnail,
            })),
        }),
    }),
});

export const {
    useGetBannersQuery,
} = bannerApi;
