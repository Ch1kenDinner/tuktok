import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { store } from "../redux";
import { mainActions } from "../redux/mainSlice";

export const BASE_URL = "https://tuktok-server.onrender.com";
// export const BASE_URL = "http://localhost:5000";

export const apiRoutes = {
  topics: "/topic/all",
  getPosts: "/post/all",
	getPostsByTopics: '/post/byTopics',
  postPost: "/post/upload",
  getVideo: (videoId: string) => `/video/${videoId}`,
  uploadAvatar: "/user/upload/avatar",
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
      window.location.replace("/");
    }
    return Promise.reject(error);
  }
);
