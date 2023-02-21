import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const apiRoutes = {
  topics: "/topic/all",
	getVideos: '/video/all',
	postVideo: '/video/upload'
};

export const api = axios.create({ baseURL: BASE_URL });