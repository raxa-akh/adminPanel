import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';


const defaultConfig: AxiosRequestConfig = {
  baseURL: "/api",
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
};

const api: AxiosInstance = axios.create(defaultConfig);

export default api;
