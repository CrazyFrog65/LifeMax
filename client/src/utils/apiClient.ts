import axios from 'axios';

const cache = new Map();

// Interceptor to handle 401 errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if not already there or on signup page
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiClient = {
  get: async (url: string, config?: any) => {
    if (cache.has(url)) {
      return cache.get(url);
    }
    const headers = { ...config?.headers, ...getHeaders() };
    const res = await axios.get(url, { ...config, headers });
    cache.set(url, res);
    return res;
  },
  post: async (url: string, data?: any, config?: any) => {
    cache.clear(); // invalidate cache on any write
    const headers = { ...config?.headers, ...getHeaders() };
    return axios.post(url, data, { ...config, headers });
  },
  delete: async (url: string, config?: any) => {
    cache.clear();
    const headers = { ...config?.headers, ...getHeaders() };
    return axios.delete(url, { ...config, headers });
  },
  put: async (url: string, data?: any, config?: any) => {
    cache.clear();
    const headers = { ...config?.headers, ...getHeaders() };
    return axios.put(url, data, { ...config, headers });
  }
};

export default apiClient;
