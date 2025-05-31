import axios, { type AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_FRONTEND_BASEURL;

export const http: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use((config) => {
    return config;
});