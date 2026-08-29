import API from "./api";

export const createVideo = async (videoData) => {
  const response = await API.post("/videos", videoData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllVideos = async () => {
  const response = await API.get("/videos");
  return response.data;
};

export const getVideoById = async (id) => {
  const response = await API.get(`/videos/${id}`);
  return response.data;
};

export const addView = async (id) => {
  const response = await API.post(`/videos/${id}/view`);
  return response.data;
};

export const addWatchTime = async (id, watchTime) => {
  const response = await API.post(`/videos/${id}/watch`, { watchTime });
  return response.data;
};