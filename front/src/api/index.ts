import axios, { AxiosError } from "axios";

export const BASE_URL = "http://localhost:5000";

export const apiRoutes = {
  topics: "/topic/all",
  getPostsPreview: "/video/all",
  postVideo: "/video/upload",
	getVideo: (videoId: string) => `/video/${videoId}`,
	uploadAvatar: '/user/upload/avatar'
};

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const profile = localStorage.getItem("profile");
  if (config.headers && profile) {
    config.headers.set("token", JSON.parse(profile).token);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status == 401) {
      localStorage.clear();
			window.location.replace('/')
    }
    return Promise.reject(error);
  }
);
