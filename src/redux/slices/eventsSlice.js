// src/redux/slices/eventsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axois";

/* =========================
   ✅ INITIAL STATE (UNCHANGED)
========================= */
const initialState = [
  {
    id: 1,
    title: "Mahagun Moderne, Noida Sector 78",
    date: "2023-10-15",
    amount: 5000,
    status: "active",
    description:
      "Maintenance fund for repainting and repairing common areas in Mahagun Moderne.",
    payments: [
      {
        memberId: 1,
        amount: 5000,
        status: "paid",
        transactions: [
          { paidAmount: 2000, date: "2023-10-05" },
          { paidAmount: 3000, date: "2023-10-10" },
        ],
      },
      {
        memberId: 2,
        amount: 5000,
        status: "paid",
        transactions: [{ paidAmount: 5000, date: "2023-10-12" }],
      },
      {
        memberId: 3,
        amount: 5000,
        status: "pending",
        transactions: [],
      },
      {
        memberId: 4,
        amount: 5000,
        status: "paid",
        transactions: [{ paidAmount: 5000, date: "2023-10-14" }],
      },
    ],
  },
];

/* =========================
   🔥 ASYNC THUNKS
========================= */

// ➕ CREATE EVENT
export const addEvent = createAsyncThunk(
  "events/addEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/societies/events/createEvent", eventData);
      console.log("message:",res)
      return res.data;
    } catch (err) {
      console.log("message:",err)
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 📥 FETCH EVENTS
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/events");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ❌ DELETE EVENT
export const deleteEventApi = createAsyncThunk(
  "events/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/events/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* =========================
   🔥 SLICE
========================= */

const eventsSlice = createSlice({
  name: "events",
  initialState,

  reducers: {
    // ➕ LOCAL ADD (optional)
    addEventLocal: (state, action) => {
      state.push({ id: Date.now(), ...action.payload, payments: [] });
    },

    // ❌ LOCAL DELETE
    deleteEvent: (state, action) => {
      return state.filter((event) => event.id !== action.payload);
    },

    // 💰 UPDATE PARTIAL PAYMENT
    updatePaidAmount: (state, action) => {
      const { eventId, memberId, paidAmount } = action.payload;

      const event = state.find((e) => e.id === eventId);
      if (!event) return;

      const payment = event.payments.find((p) => p.memberId === memberId);
      if (!payment) return;

      payment.transactions.push({
        paidAmount,
        date: new Date().toISOString().split("T")[0],
      });

      const totalPaid = payment.transactions.reduce(
        (sum, t) => sum + t.paidAmount,
        0
      );

      payment.status = totalPaid >= payment.amount ? "paid" : "pending";
    },

    // ✅ FULL PAY MEMBER
    fullPayMember: (state, action) => {
      const { eventId, memberId } = action.payload;

      const event = state.find((e) => e.id === eventId);
      if (!event) return;

      const payment = event.payments.find((p) => p.memberId === memberId);
      if (!payment) return;

      payment.transactions.push({
        paidAmount: payment.amount,
        date: new Date().toISOString().split("T")[0],
      });

      payment.status = "paid";
    },
  },

  extraReducers: (builder) => {
    builder

      // 📥 FETCH → replace state
      .addCase(fetchEvents.fulfilled, (state, action) => {
        return action.payload.map((event) => ({
          ...event,
          id: event._id,
          payments: [],
        }));
      })

      // ➕ ADD EVENT
      .addCase(addEvent.fulfilled, (state, action) => {
        state.push({
          ...action.payload,
          id: action.payload._id,
          payments: [],
        });
      })

      // ❌ DELETE EVENT
      .addCase(deleteEventApi.fulfilled, (state, action) => {
        return state.filter(
          (event) =>
            event.id !== action.payload && event._id !== action.payload
        );
      });
  },
});

/* =========================
   ✅ EXPORTS
========================= */

export const {
  addEventLocal,
  deleteEvent,
  updatePaidAmount,
  fullPayMember,
} = eventsSlice.actions;

export default eventsSlice.reducer;