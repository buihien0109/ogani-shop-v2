import { createApi } from "@reduxjs/toolkit/query/react";
import { DOMAIN } from "../../data/constants";
import { baseQueryPublic } from "./baseQuery";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: baseQueryPublic,
    tagTypes: ['Product', 'Review'],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ limit }) => {
                const params = {};
                if (limit) params.limit = limit;
                return {
                    url: `/products/all`,
                    method: "GET",
                    params: params
                }
            },
            transformResponse: (response) => {
                return response.map((item) => ({
                    ...item,
                    data: {
                        ...item.data,
                        content: item.data.content.map((product) => ({
                            ...product,
                            thumbnail: product.thumbnail.startsWith("/api") ? `${DOMAIN}${product.thumbnail}` : product.thumbnail,
                            subImages: product.subImages.map((image) => image.startsWith("/api") ? `${DOMAIN}${image}` : image),
                        }))
                    }
                }))
            }
        }),
        getDiscountedProducts: builder.query({
            query: ({ page, limit }) => {
                const params = {};
                if (page) params.page = page;
                if (limit) params.limit = limit;
                return {
                    url: `/products/discount`,
                    method: "GET",
                    params: params
                }
            },
            transformResponse: (response) => {
                return {
                    ...response,
                    content: response.content.map((product) => ({
                        ...product,
                        thumbnail: product.thumbnail.startsWith("/api") ? `${DOMAIN}${product.thumbnail}` : product.thumbnail,
                        subImages: product.subImages.map((image) => image.startsWith("/api") ? `${DOMAIN}${image}` : image),
                    })),
                };
            }
        }),
        getProductsByCategory: builder.query({
            query: ({ page, limit, parentSlug, subSlug }) => {
                const params = {};
                if (page) params.page = page;
                if (limit) params.limit = limit;
                if (parentSlug) params.parentSlug = parentSlug;
                if (subSlug) params.subSlug = subSlug;
                return {
                    url: `/products`,
                    method: "GET",
                    params: params
                }
            },
            transformResponse: (response) => {
                return {
                    ...response,
                    content: response.content.map((product) => ({
                        ...product,
                        thumbnail: product.thumbnail.startsWith("/api") ? `${DOMAIN}${product.thumbnail}` : product.thumbnail,
                        subImages: product.subImages.map((image) => image.startsWith("/api") ? `${DOMAIN}${image}` : image),
                    })),
                };
            }
        }),
        getProductDetail: builder.query({
            query: ({ productId, productSlug }) => `/products/${productId}/${productSlug}`,
            transformResponse: (response) => ({
                ...response,
                thumbnail: response.thumbnail.startsWith("/api") ? `${DOMAIN}${response.thumbnail}` : response.thumbnail,
                subImages: response.subImages.map((image) => image.startsWith("/api") ? `${DOMAIN}${image}` : image),
            })
        }),
        getReviewsByProduct: builder.query({
            query: ({ productId }) => `/products/${productId}/reviews`,
            transformResponse: (response) => {
                return response.map((review) => ({
                    ...review,
                    user: review.user !== null ? {
                        ...review.user,
                        avatar: review.user.avatar.startsWith("/api") ? `${DOMAIN}${review.user.avatar}` : review.user.avatar,
                    } : null,
                    authorAvatar: review.authorAvatar !== null
                        ? review.authorAvatar.startsWith("/api") ? `${DOMAIN}${review.authorAvatar}` : review.authorAvatar
                        : null,
                }))
            },
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Review', id })), { type: 'Review', id: 'LIST' }]
                    : [{ type: 'Review', id: 'LIST' }],
        }),
        getRelatedProducts: builder.query({
            query: ({ productId }) => `/products/${productId}/related-products`,
            transformResponse: (response) => {
                return response.map((product) => ({
                    ...product,
                    thumbnail: product.thumbnail.startsWith("/api") ? `${DOMAIN}${product.thumbnail}` : product.thumbnail,
                    subImages: product.subImages.map((image) => image.startsWith("/api") ? `${DOMAIN}${image}` : image),
                }))
            }
        }),
    })
});

export const {
    useGetProductsQuery,
    useGetDiscountedProductsQuery,
    useGetProductsByCategoryQuery,
    useGetProductDetailQuery,
    useGetReviewsByProductQuery,
    useGetRelatedProductsQuery
} = productApi;
