// lib/api/spendApi.js
import { axiosInstance } from "../axois";

// ─── Get all spends for an event ───────────────────────────────────────────
export const getEventSpends = async (eventId) => {
  const res = await axiosInstance.get(`/societies/events/${eventId}/spends`);
  return res.data;
};

// ─── Add a spend (multipart/form-data for receipt image) ───────────────────
export const addSpend = async (formData) => {
  const res = await axiosInstance.post("/societies/events/spends/addSpend", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ─── Update a spend ────────────────────────────────────────────────────────
export const updateSpend = async (spendId, formData) => {
  const res = await axiosInstance.put(`/societies/events/spend/${spendId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ─── Delete a spend ────────────────────────────────────────────────────────
export const deleteSpend = async (spendId) => {
  const res = await axiosInstance.delete(`/societies/events/spend/${spendId}`);
  return res.data;
};