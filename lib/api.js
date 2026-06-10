import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
    "Workspaces-Identifier": process.env.NEXT_PUBLIC_WORKSPACE_ID,
    "X-Integration-Name": process.env.NEXT_PUBLIC_INTEGRATION_NAME,
  },
});

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const cache = new Map();

api.getCached = async (url) => {
  const now = Date.now();
  const cached = cache.get(url);

  // 30s cache window
  if (cached && now - cached.time < 30000) {
    return cached.data;
  }

  const res = await api.get(url);

  cache.set(url, {
    data: res,
    time: now,
  });

  return res;
};

export default api;
