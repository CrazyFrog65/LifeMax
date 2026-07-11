import axios from 'axios';

const cache = new Map();

const apiClient = {
  get: async (url: string, config?: any) => {
    if (cache.has(url)) {
      return cache.get(url);
    }
    const res = await axios.get(url, config);
    cache.set(url, res);
    return res;
  },
  post: async (url: string, data?: any, config?: any) => {
    cache.clear(); // invalidate cache on any write
    return axios.post(url, data, config);
  },
  delete: async (url: string, config?: any) => {
    cache.clear();
    return axios.delete(url, config);
  },
  put: async (url: string, data?: any, config?: any) => {
    cache.clear();
    return axios.put(url, data, config);
  }
};

export default apiClient;
