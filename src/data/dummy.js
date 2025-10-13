// src/data/dummy.js
export const dummyEvents = [
  { id: 1, name: "Annual Function 2024", title: "Mahagun Moderne, Noida Sector 78", date: "2024-03-15", venue: "Community Hall", totalMembers: 6, paidMembers: 3, totalCollected: 1900, pendingPayments: 3, status: "active", progress: 65, category: "Cultural", color: "blue", type: "society", societyId: "soc_001", societyName: "Mahagun Moderne" },
  { id: 2, name: "Maintenance Collection", title: "DLF Phase 4, Gurgaon", date: "2024-02-01", venue: "Society Office", totalMembers: 5, paidMembers: 2, totalCollected: 1100, pendingPayments: 3, status: "completed", progress: 100, category: "Maintenance", color: "green", type: "society", societyId: "soc_002", societyName: "DLF Phase 4" },
  { id: 3, name: "Personal Birthday Party", title: "John's Birthday Celebration", date: "2024-04-01", venue: "Home Garden", totalMembers: 4, paidMembers: 4, totalCollected: 2000, pendingPayments: 0, status: "active", progress: 100, category: "Personal", color: "amber", type: "individual", isPersonal: true },
  { id: 4, name: "Security Upgrade", title: "Gaur City 2, Greater Noida West", date: "2024-01-20", venue: "Society Premises", totalMembers: 8, paidMembers: 5, totalCollected: 4000, pendingPayments: 3, status: "active", progress: 62, category: "Security", color: "purple", type: "society", societyId: "soc_003", societyName: "Gaur City 2" },
  { id: 5, name: "Weekend Trip", title: "Friends Weekend Getaway", date: "2024-05-10", venue: "Mountain Resort", totalMembers: 6, paidMembers: 2, totalCollected: 1200, pendingPayments: 4, status: "active", progress: 33, category: "Travel", color: "emerald", type: "individual", isPersonal: true }
];

export const dummySocieties = [
  { id: "soc_001", name: "Mahagun Moderne", address: "Noida Sector 78", totalMembers: 150, activeEvents: 2, totalCollected: 15000, status: "active" },
  { id: "soc_002", name: "DLF Phase 4", address: "Gurgaon", totalMembers: 200, activeEvents: 1, totalCollected: 25000, status: "active" },
  { id: "soc_003", name: "Gaur City 2", address: "Greater Noida West", totalMembers: 180, activeEvents: 1, totalCollected: 18000, status: "active" }
];
