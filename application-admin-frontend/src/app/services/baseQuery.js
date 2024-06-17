import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_DOMAIN, API_DOMAIN_ADMIN, API_DOMAIN_PUBLIC, API_DOMAIN_USER } from '../../data/constants';

export const baseQuery = fetchBaseQuery({
    baseUrl: API_DOMAIN_ADMIN,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryPublic = fetchBaseQuery({
    baseUrl: API_DOMAIN_PUBLIC,
});

export const baseQueryUser = fetchBaseQuery({
    baseUrl: API_DOMAIN_USER,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryAuth = fetchBaseQuery({
    baseUrl: API_DOMAIN,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});
