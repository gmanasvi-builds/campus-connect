export const STATES = [
  "Telangana",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Delhi NCR",
  "Uttar Pradesh",
  "West Bengal",
  "Kerala",
  "Gujarat",
  "Rajasthan",
];

export const UNIVERSITIES = [
  "JNTU Hyderabad",
  "Osmania University",
  "Anna University",
  "Mumbai University",
  "VTU Karnataka",
  "Delhi University",
  "CBSE Board",
  "State Board (Intermediate)",
];

export const COLLEGES = [
  "CBIT, Gandipet",
  "Vasavi College of Engineering",
  "MVSR Engineering College",
  "St. Francis College",
  "Narayana Junior College",
  "Sri Chaitanya",
  "Loyola Academy",
];

export const DEPARTMENTS = [
  "Computer Science (CSE)",
  "Electronics (ECE)",
  "Mechanical",
  "Civil",
  "Information Technology",
  "MPC (Intermediate)",
  "BiPC (Intermediate)",
  "Commerce",
];

export type Note = {
  id: string;
  title: string;
  subject: string;
  author: string;
  type: "Notes" | "Lab Manual" | "Past Paper";
  price: number;
  pages: number;
  downloads: number;
  trending?: boolean;
};

export const RENTAL_DURATIONS = [
  "Sale (no return)",
  "1 day",
  "3 days",
  "1 week",
  "2 weeks",
  "1 month",
  "1 semester",
  "1 academic year",
] as const;

export type RentalDuration = (typeof RENTAL_DURATIONS)[number];

export type Book = {
  id: string;
  title: string;
  category: string;
  condition: "New" | "Used";
  price: number;
  seller: string;
  distanceKm: number;
  emoji: string;
  rentalDuration?: RentalDuration;
};

export type Ride = {
  id: string;
  origin: string;
  destination: string;
  time: string;
  seats: number;
  mode: "Auto" | "Cab" | "Bus" | "Bike";
  host: string;
  costPerHead: number;
  distanceKm?: number;
};

export const NOTES: Note[] = [
  {
    id: "n1",
    title: "Data Structures — Complete Unit Notes",
    subject: "DSA",
    author: "Aarav (3rd Year CSE)",
    type: "Notes",
    price: 0,
    pages: 48,
    downloads: 312,
    trending: true,
  },
  {
    id: "n2",
    title: "DBMS Solved Previous Papers (2019–2024)",
    subject: "DBMS",
    author: "Sneha (4th Year IT)",
    type: "Past Paper",
    price: 30,
    pages: 64,
    downloads: 248,
    trending: true,
  },
  {
    id: "n3",
    title: "Engineering Physics Lab Manual",
    subject: "Physics",
    author: "Rahul (2nd Year ECE)",
    type: "Lab Manual",
    price: 20,
    pages: 36,
    downloads: 190,
  },
  {
    id: "n4",
    title: "Operating Systems — Quick Revision",
    subject: "OS",
    author: "Priya (3rd Year CSE)",
    type: "Notes",
    price: 0,
    pages: 22,
    downloads: 405,
    trending: true,
  },
  {
    id: "n5",
    title: "Maths-II (Calculus) Important Questions",
    subject: "Mathematics",
    author: "Karthik (2nd Year)",
    type: "Past Paper",
    price: 15,
    pages: 18,
    downloads: 156,
  },
];

export const BOOKS: Book[] = [
  {
    id: "b1",
    title: "Let Us C — Yashavant Kanetkar",
    category: "Textbook",
    condition: "Used",
    price: 120,
    seller: "Vikram, CBIT",
    distanceKm: 0.4,
    emoji: "📘",
  },
  {
    id: "b2",
    title: "Mini Drafter (Engineering Drawing)",
    category: "Equipment",
    condition: "Used",
    price: 250,
    seller: "Ananya, Vasavi",
    distanceKm: 1.2,
    emoji: "📐",
  },
  {
    id: "b3",
    title: "White Lab Coat (M Size)",
    category: "Apparel",
    condition: "New",
    price: 300,
    seller: "Rohit, MVSR",
    distanceKm: 0.8,
    emoji: "🥼",
  },
  {
    id: "b4",
    title: "HC Verma Vol 1 & 2",
    category: "Textbook",
    condition: "Used",
    price: 200,
    seller: "Meera, Narayana",
    distanceKm: 2.1,
    emoji: "📕",
  },
  {
    id: "b5",
    title: "Scientific Calculator (Casio fx-991)",
    category: "Equipment",
    condition: "Used",
    price: 450,
    seller: "Sai, CBIT",
    distanceKm: 0.6,
    emoji: "🧮",
  },
];

export const RIDES: Ride[] = [
  {
    id: "r1",
    origin: "Secunderabad Station",
    destination: "CBIT Campus",
    time: "8:30 AM",
    seats: 2,
    mode: "Auto",
    host: "Nikhil",
    costPerHead: 35,
    distanceKm: 1.8,
  },
  {
    id: "r2",
    origin: "Ameerpet Metro",
    destination: "Vasavi College",
    time: "9:00 AM",
    seats: 3,
    mode: "Cab",
    host: "Divya",
    costPerHead: 60,
    distanceKm: 3.4,
  },
  {
    id: "r3",
    origin: "Mehdipatnam",
    destination: "MVSR Engineering",
    time: "8:15 AM",
    seats: 1,
    mode: "Bike",
    host: "Arjun",
    costPerHead: 0,
    distanceKm: 0.9,
  },
  {
    id: "r4",
    origin: "Dilsukhnagar",
    destination: "Campus Gate 2",
    time: "5:30 PM",
    seats: 4,
    mode: "Bus",
    host: "Pooja",
    costPerHead: 25,
    distanceKm: 5.2,
  },
];

export type CampusEventCategory = "Cultural" | "Technical" | "Sports" | "Workshop";

export const EVENT_CATEGORIES: CampusEventCategory[] = ["Cultural", "Technical", "Sports", "Workshop"];

export const EVENT_EMOJI: Record<CampusEventCategory, string> = {
  Cultural: "🎭",
  Technical: "💻",
  Sports: "🏏",
  Workshop: "🛠️",
};

export type CampusEvent = {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  venue: string;
  category: CampusEventCategory;
  participation: boolean;
  participantMode: "Individual" | "Team" | "Both";
  maxTeamSize: number;
  volunteering: boolean;
  volunteersNeeded: number;
  roles: string[];
  slots: string[];
  contact: string;
};

export const EVENTS: CampusEvent[] = [
  { id: "e1", title: "HackCBIT 24-hr Hackathon", description: "Build anything in 24 hours.", dateTime: "2026-10-24T09:00", venue: "CBIT Main Auditorium", category: "Technical", participation: true, participantMode: "Team", maxTeamSize: 4, volunteering: true, volunteersNeeded: 15, roles: ["Registration Desk", "Tech Support", "Food & Logistics"], slots: ["9 AM – 3 PM", "3 PM – 9 PM", "Overnight"], contact: "hack@cbit.ac.in" },
  { id: "e2", title: "Navrang Cultural Fest", description: "Dance, music, and drama.", dateTime: "2026-11-02T17:00", venue: "Open Air Theatre", category: "Cultural", participation: true, participantMode: "Both", maxTeamSize: 8, volunteering: true, volunteersNeeded: 25, roles: ["Stage Crew", "Hospitality", "Photography"], slots: ["4 PM – 7 PM", "7 PM – 10 PM"], contact: "+91 98765 43210" },
  { id: "e3", title: "Inter-College Cricket Cup", description: "T10 knockout tournament.", dateTime: "2026-11-09T07:30", venue: "Sports Ground", category: "Sports", participation: true, participantMode: "Team", maxTeamSize: 11, volunteering: false, volunteersNeeded: 0, roles: [], slots: [], contact: "" },
  { id: "e4", title: "Intro to Figma Workshop", description: "Hands-on UI design basics.", dateTime: "2026-10-18T14:00", venue: "Lab 204, IT Block", category: "Workshop", participation: true, participantMode: "Individual", maxTeamSize: 1, volunteering: true, volunteersNeeded: 3, roles: ["Lab Assistant"], slots: ["1:30 PM – 5 PM"], contact: "design.club@vce.ac.in" },
  { id: "e5", title: "Campus Clean-Up Drive", description: "Help keep our campus green.", dateTime: "2026-10-20T07:00", venue: "Gate 1", category: "Cultural", participation: false, participantMode: "Individual", maxTeamSize: 1, volunteering: true, volunteersNeeded: 40, roles: ["Collection", "Segregation", "Awareness"], slots: ["7 AM – 9 AM", "9 AM – 11 AM"], contact: "nss@cbit.ac.in" },
];

export function formatEventDateTime(dt: string) {
  const d = new Date(dt);
  if (isNaN(d.getTime())) return dt;
  return d.toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

export const SUBJECTS = ["DSA", "DBMS", "OS", "Physics", "Mathematics", "Networks", "AI/ML"];
