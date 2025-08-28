// src/redux/eventsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = [
  {
    id: 1,
    title: "Building Maintenance Fund",
    date: "2023-10-15",
    amount: 5000,
    description: "Funds for building painting and repairs",
    payments: [
      {
        memberId: 1,
        amount: 5000,
        paidAmount: 5000,
        status: "paid",
        date: "2023-10-10",
      },
      {
        memberId: 2,
        amount: 5000,
        paidAmount: 5000,
        status: "paid",
        date: "2023-10-12",
      },
      { memberId: 3, amount: 5000, paidAmount: 0, status: "pending", date: "" },
      {
        memberId: 4,
        amount: 5000,
        paidAmount: 5000,
        status: "paid",
        date: "2023-10-14",
      },
      { memberId: 5, amount: 5000, paidAmount: 0, status: "pending", date: "" },
      {
        memberId: 6,
        amount: 5000,
        paidAmount: 5000,
        status: "paid",
        date: "2023-10-11",
      },
      { memberId: 7, amount: 5000, paidAmount: 0, status: "pending", date: "" },
      {
        memberId: 8,
        amount: 5000,
        paidAmount: 5000,
        status: "paid",
        date: "2023-10-13",
      },
    ],
  },
  {
    id: "2",
    title: "Festival Celebration Fund",
    date: "2023-12-01",
    amount: 3000,
    description: "Funds for Diwali celebration and decorations",
    payments: [
      {
        memberId: 1,
        amount: 3000,
        paidAmount: 3000,
        status: "paid",
        date: "2023-11-25",
      },
      { memberId: 2, amount: 3000, paidAmount: 0, status: "pending", date: "" },
      {
        memberId: 3,
        amount: 3000,
        paidAmount: 3000,
        status: "paid",
        date: "2023-11-28",
      },
      {
        memberId: 4,
        amount: 3000,
        paidAmount: 3000,
        status: "paid",
        date: "2023-11-27",
      },
      { memberId: 5, amount: 3000, paidAmount: 0, status: "pending", date: "" },
      {
        memberId: 6,
        amount: 3000,
        paidAmount: 3000,
        status: "paid",
        date: "2023-11-29",
      },
      {
        memberId: 7,
        amount: 3000,
        paidAmount: 3000,
        status: "paid",
        date: "2023-11-26",
      },
      { memberId: 8, amount: 3000, paidAmount: 0, status: "pending", date: "" },
    ],
  },
];
const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.push({ id: uuidv4(), ...action.payload });
    },
    deleteEvent: (state, action) => {
      return state.filter((event) => event.id !== action.payload);
    },

    updatePaidAmount: (state, action) => {
      const { eventId, memberId, paidAmount } = action.payload;

      const event = state.find((e) => e.id === eventId);
      if (event) {
        const payment = event.payments.find((p) => p.memberId === memberId);
        if (payment) {
          payment.paidAmount =payment.paidAmount + paidAmount;
          payment.status = paidAmount >= payment.amount ? "paid" : "pending";
          payment.date =
            paidAmount > 0 ? new Date().toISOString().split("T")[0] : "";
        }
      }
    },


     // ✅ Full pay one member
    fullPayMember: (state, action) => {
      const { eventId, memberId } = action.payload;

      const event = state.find(e => e.id === eventId);
      if (event) {
        const payment = event.payments.find(p => p.memberId === memberId);
        if (payment) {
          payment.paidAmount = payment.amount; // full amount
          payment.status = "paid";
          payment.date = new Date().toISOString().split("T")[0];
        }
      }
    },

  },
});

export const { addEvent, deleteEvent,updatePaidAmount,fullPayMember} = eventsSlice.actions;
export default eventsSlice.reducer;
