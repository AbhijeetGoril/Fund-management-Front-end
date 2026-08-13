import { axiosInstance } from "../axois";

// POST /api/spends/addSpend
export const addSpend = async (fd) => {
  const { data } = await axiosInstance.post("/spends/addSpend", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// GET /api/spends/event/:eventId
export const getEventSpends = async (eventId) => {
  const { data } = await axiosInstance.get(`/spends/event/${eventId}`);
  return data;
};

// PUT /api/spends/:spendId
export const updateSpend = async (id, fd) => {
  const { data } = await axiosInstance.put(`/spends/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// DELETE /api/spends/:spendId
export const deleteSpend = async (id) => {
  const { data } = await axiosInstance.delete(`/spends/${id}`);
  return data;
};