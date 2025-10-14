// Ensure numbers are numbers and every society has an events array
export const societies = [
  {
    id: "soc_001",
    name: "Mahagun Moderne",
    address: "Noida Sector 78",
    totalMembers: 150,
    status: "active",
    totalCollected: 15000,
    events: [
      {
        id: 1,
        title: "Mahagun Moderne, Noida Sector 78",
        name: "Annual Function 2024",
        date: "2024-03-15",
        venue: "Community Hall",
        totalMembers: 6,
        paidMembers: 3,
        totalCollected: 1900,
        pendingPayments: 3,
        status: "active",
        progress: 65,
        category: "Cultural",
        color: "blue",
        type: "society"
      }
    ]
  },
  {
    id: "soc_002",
    name: "DLF Phase 4",
    address: "Gurgaon",
    totalMembers: 200,
    status: "active",
    totalCollected: 25000,
    events: [
      {
        id: 2,
        title: "DLF Phase 4, Gurgaon",
        name: "Maintenance Collection",
        date: "2024-02-01",
        venue: "Society Office",
        totalMembers: 5,
        paidMembers: 2,
        totalCollected: 1100,
        pendingPayments: 3,
        status: "completed",
        progress: 100,
        category: "Maintenance",
        color: "green",
        type: "society"
      }
    ]
  },
  {
    id: "soc_003",
    name: "Gaur City 2",
    address: "Greater Noida West",
    totalMembers: 180,
    status: "active",
    totalCollected: 18000,
    events: [
      {
        id: 4,
        title: "Gaur City 2, Greater Noida West",
        name: "Security Upgrade",
        date: "2024-01-20",
        venue: "Society Premises",
        totalMembers: 8,
        paidMembers: 5,
        totalCollected: 4000,
        pendingPayments: 3,
        status: "active",
        progress: 62,
        category: "Security",
        color: "purple",
        type: "society"
      }
    ]
  }
];

// Personal events kept separate for the Events tab
export const personalEvents = [
  {
    id: 3,
    title: "John's Birthday Celebration",
    name: "Personal Birthday Party",
    date: "2024-04-01",
    venue: "Home Garden",
    totalMembers: 4,
    paidMembers: 4,
    totalCollected: 2000,
    pendingPayments: 0,
    status: "active",
    progress: 100,
    category: "Personal",
    color: "amber",
    type: "individual",
    isPersonal: true
  },
  {
    id: 5,
    title: "Friends Weekend Getaway",
    name: "Weekend Trip",
    date: "2024-05-10",
    venue: "Mountain Resort",
    totalMembers: 6,
    paidMembers: 2,
    totalCollected: 1200,
    pendingPayments: 4,
    status: "active",
    progress: 33,
    category: "Travel",
    color: "emerald",
    type: "individual",
    isPersonal: true
  },

  // New: completed example
  {
    id: 6,
    title: "Exam Celebration Dinner",
    name: "Dinner with Family",
    date: "2024-06-20",
    venue: "City Restaurant",
    totalMembers: 5,
    paidMembers: 5,
    totalCollected: 3500,
    pendingPayments: 0,
    status: "completed",
    progress: 100,
    category: "Personal",
    color: "blue",
    type: "individual",
    isPersonal: true
  },

  // New: active example
  {
    id: 7,
    title: "Yoga Workshop",
    name: "Morning Yoga Session",
    date: "2024-07-12",
    venue: "Community Park",
    totalMembers: 12,
    paidMembers: 8,
    totalCollected: 2400,
    pendingPayments: 4,
    status: "active",
    progress: 70,
    category: "Health",
    color: "purple",
    type: "individual",
    isPersonal: true
  },

  // New: completed example
  {
    id: 8,
    title: "Coding Meetup",
    name: "Weekend Hack Session",
    date: "2024-08-03",
    venue: "Co-working Space",
    totalMembers: 10,
    paidMembers: 10,
    totalCollected: 5000,
    pendingPayments: 0,
    status: "completed",
    progress: 100,
    category: "Tech",
    color: "green",
    type: "individual",
    isPersonal: true
  }
];

