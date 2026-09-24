import axios from 'axios';

export const createClient = (baseURL) => {
  const client = axios.create({ baseURL, timeout: 10000, headers: { 'Content-Type': 'application/json' } });
  client.interceptors.response.use(r => r, error => {
    const status = error.response?.status;
    const message = error.response?.data?.message || (status ? `Request failed (${status})` : 'Unable to reach the backend service.');
    return Promise.reject(new Error(message));
  });
  return client;
};
