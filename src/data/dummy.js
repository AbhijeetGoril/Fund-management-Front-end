// Ensure numbers are numbers and every society has an events array
export const societies = [
  {
    id: "soc_001",
    name: "Mahagun Moderne",
    address: "Noida Sector 78",
    totalMembers: 150,
    status: "active",
    totalCollected: 31500, // sum of event totals or society-level funds
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
      },
      {
        id: 9,
        title: "Spring Clean-up Drive",
        name: "Cleanliness Campaign",
        date: "2024-03-30",
        venue: "Society Premises",
        totalMembers: 10,
        paidMembers: 7,
        totalCollected: 3500,
        pendingPayments: 3,
        status: "active",
        progress: 70,
        category: "Community",
        color: "emerald",
        type: "society"
      },
      {
        id: 10,
        title: "Diwali Decoration",
        name: "Festive Lighting",
        date: "2024-11-01",
        venue: "Club House",
        totalMembers: 12,
        paidMembers: 12,
        totalCollected: 12000,
        pendingPayments: 0,
        status: "completed",
        progress: 100,
        category: "Festival",
        color: "amber",
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
    totalCollected: 40200,
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
      },
      {
        id: 11,
        title: "Security Camera Upgrade",
        name: "CCTV Phase II",
        date: "2024-05-22",
        venue: "Blocks A–D",
        totalMembers: 15,
        paidMembers: 9,
        totalCollected: 9000,
        pendingPayments: 6,
        status: "active",
        progress: 60,
        category: "Security",
        color: "purple",
        type: "society"
      },
      {
        id: 12,
        title: "Water Tank Cleaning",
        name: "Quarterly Cleaning",
        date: "2024-06-10",
        venue: "Basement Tanks",
        totalMembers: 8,
        paidMembers: 8,
        totalCollected: 6400,
        pendingPayments: 0,
        status: "completed",
        progress: 100,
        category: "Maintenance",
        color: "blue",
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
    totalCollected: 25800,
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
      },
      {
        id: 13,
        title: "Monsoon Drainage",
        name: "Stormwater Prep",
        date: "2024-07-05",
        venue: "Perimeter",
        totalMembers: 9,
        paidMembers: 6,
        totalCollected: 5400,
        pendingPayments: 3,
        status: "active",
        progress: 55,
        category: "Infrastructure",
        color: "emerald",
        type: "society"
      },
      {
        id: 14,
        title: "Community Tree Plantation",
        name: "Green Drive",
        date: "2024-08-15",
        venue: "Central Park",
        totalMembers: 14,
        paidMembers: 14,
        totalCollected: 9800,
        pendingPayments: 0,
        status: "completed",
        progress: 100,
        category: "Environment",
        color: "green",
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

