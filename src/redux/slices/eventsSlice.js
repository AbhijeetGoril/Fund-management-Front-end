// src/redux/eventsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";


const initialState = [
  {
    id: 1,
    title: "Mahagun Moderne, Noida Sector 78",
    date: "2023-10-15",
    amount: 5000,
    status: "active",
    description: "Maintenance fund for repainting and repairing common areas in Mahagun Moderne.",
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
  {
    id: 2,
    title: "DLF Phase 4, Gurgaon",
    date: "2023-12-01",
    amount: 3000,
    status: "active",
    description: "Fund for Diwali celebration and decorations across DLF Phase 4 community parks.",
    payments: [
      {
        memberId: 1,
        amount: 3000,
        status: "paid",
        transactions: [{ paidAmount: 3000, date: "2023-11-25" }],
      },
      {
        memberId: 2,
        amount: 3000,
        status: "pending",
        transactions: [],
      },
      {
        memberId: 3,
        amount: 3000,
        status: "paid",
        transactions: [
          { paidAmount: 1000, date: "2023-11-27" },
          { paidAmount: 2000, date: "2023-11-28" },
        ],
      },
      {
        memberId: 4,
        amount: 3000,
        status: "paid",
        transactions: [{ paidAmount: 3000, date: "2023-11-27" }],
      },
    ],
  },
  {
    id: 3,
    title: "ATS Greens Village, Noida Sector 93A",
    date: "2024-01-05",
    amount: 4000,
    status: "upcoming",
    description: "Fund collection for New Year celebration event at ATS Greens Village clubhouse.",
    payments: [
      {
        memberId: 1,
        amount: 4000,
        status: "pending",
        transactions: [],
      },
      {
        memberId: 2,
        amount: 4000,
        status: "pending",
        transactions: [],
      },
      {
        memberId: 3,
        amount: 4000,
        status: "pending",
        transactions: [],
      },
      {
        memberId: 4,
        amount: 4000,
        status: "pending",
        transactions: [],
      },
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
          payment.transactions.push({
            paidAmount,
            date: new Date().toISOString().split("T")[0],
          });
          const totalPaid = payment.transactions.reduce(
            (sum, t) => sum + t.paidAmount,
            0
          );
          payment.status = totalPaid >= payment.amount ? "paid" : "pending";
        }
      }
    },

    // ✅ Full pay one member
    fullPayMember: (state, action) => {
      const { eventId, memberId } = action.payload;

      const event = state.find((e) => e.id === eventId);
      if (event) {
        const payment = event.payments.find((p) => p.memberId === memberId);
        if (payment) {
          payment.paidAmount = payment.amount; // full amount
          payment.status = "paid";
          payment.date = new Date().toISOString().split("T")[0];
        }
      }
    },
  },
});

export const { addEvent, deleteEvent, updatePaidAmount, fullPayMember } =
  eventsSlice.actions;
export default eventsSlice.reducer;
