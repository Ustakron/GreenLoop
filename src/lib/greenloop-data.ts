export const acceptedWasteTypes = [
  {
    id: "plastics",
    icon: "🧴",
    title: "Plastics",
    description: "Focus on PET bottles (water bottles) and HDPE (milk, shampoo bottles).",
    partners: ["YOUTURN by GC", "Wongpanit"]
  },
  {
    id: "paper",
    icon: "📦",
    title: "Paper / Cardboard",
    description: "Corrugated boxes and clean white paper. Perfect for recycling into new packaging.",
    partners: ["SCG Packaging", "Wongpanit"]
  },
  {
    id: "metals",
    icon: "🥫",
    title: "Metals",
    description: "Aluminum beverage cans and scrap metals. High value and infinitely recyclable.",
    partners: ["Wongpanit"]
  },
  {
    id: "ewaste",
    icon: "📱",
    title: "E-Waste",
    description: "Phones, cables, and circuit boards. Contains precious metals that need proper recovery.",
    partners: ["AIS E-Waste", "TES"]
  }
];

export const checklistItems = [
  {
    id: "clean",
    icon: "🧽",
    title: "Empty & Clean",
    description: "All containers must be rinsed and free of food or liquid residue."
  },
  {
    id: "sorted",
    icon: "🗂️",
    title: "Sorted by Type",
    description: "Keep plastics, paper, and metals separate for easier processing."
  },
  {
    id: "dry",
    icon: "☀️",
    title: "Dry & Compact",
    description: "Flatten boxes and cans to save space, and ensure everything is dry."
  }
];

export const pickupSlots = [
  { id: "slot-morning", label: "09:00 - 12:00", description: "Morning collection", bonus: 0, eco: false },
  { id: "slot-afternoon", label: "13:00 - 16:00", description: "Afternoon collection", bonus: 0, eco: false },
  { id: "slot-eco", label: "09:00 - 18:00", description: "Flexible (Route Optimized)", bonus: 20, eco: true }
];

export const rewardItems = [
  {
    id: "r1",
    title: "30% Shipping Voucher",
    description: "Get 30% off your next delivery with our partner courier.",
    cost: 500,
    icon: "🚚",
    code: "GL30OFF",
    locked: false
  },
  {
    id: "r2",
    title: "50 THB Cash Voucher",
    description: "Redeemable at participating eco-stores.",
    cost: 1000,
    icon: "💵",
    code: "ECO50",
    locked: false
  },
  {
    id: "r3",
    title: "Eco-Friendly Tote Bag",
    description: "Limited edition recycled material tote.",
    cost: 2500,
    icon: "🛍️",
    code: "GREEBAG",
    locked: true
  }
];

export const activityHistory = [
  { id: "a1", title: "Waste Pickup Confirmed", points: 140, date: "Apr 20, 2026" },
  { id: "a2", title: "Redeemed 30% Shipping Voucher", points: -500, date: "Apr 18, 2026" },
  { id: "a3", title: "Waste Pickup Confirmed", points: 220, date: "Apr 12, 2026" }
];
