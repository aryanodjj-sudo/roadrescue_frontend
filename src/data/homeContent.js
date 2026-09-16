import {
  FaShieldAlt,
  FaClock,
  FaMapMarkedAlt,
  FaRupeeSign,
  FaHeadset,
  FaMobileAlt,
} from "react-icons/fa";

// Headline numbers shown in the hero trust bar.
// NOTE: these are showcase figures for the landing page, not live DB counts.
export const heroStats = [
  { value: "12K+", label: "Rescues Completed" },
  { value: "850+", label: "Verified Partners" },
  { value: "14 min", label: "Avg. Arrival" },
  { value: "4.8★", label: "Customer Rating" },
];

export const whyUsFeatures = [
  {
    icon: FaShieldAlt,
    title: "Verified Partners Only",
    description:
      "Every mechanic passes identity, document and skill verification before they can accept a single job.",
  },
  {
    icon: FaClock,
    title: "Help in Minutes",
    description:
      "Smart matching picks the closest available partner so you're never stuck waiting on the roadside.",
  },
  {
    icon: FaMapMarkedAlt,
    title: "Live GPS Tracking",
    description:
      "Watch your mechanic move towards you on a live map with a constantly updating distance and ETA.",
  },
  {
    icon: FaRupeeSign,
    title: "Transparent Pricing",
    description:
      "See the exact price before you confirm. Apply coupons, or go free with a RoadRescue subscription.",
  },
  {
    icon: FaHeadset,
    title: "Real Human Support",
    description:
      "Raise a complaint or dispute from your dashboard and our admin team resolves it with a tracked status.",
  },
  {
    icon: FaMobileAlt,
    title: "Built for Emergencies",
    description:
      "Large tap targets, clear steps and a mobile-first layout designed for stressful roadside moments.",
  },
];

export const testimonials = [
  {
    name: "Aditya Sharma",
    role: "Car Owner, Delhi",
    rating: 5,
    quote:
      "Battery died at 11pm on the highway. A verified mechanic reached me in under 10 minutes and I could watch him coming on the map the whole time.",
  },
  {
    name: "Priya Nair",
    role: "SUV Owner, Noida",
    rating: 5,
    quote:
      "I booked a tow for my father from a different city using the manual address option. He didn't even need the app. That feature alone sold me.",
  },
  {
    name: "Rohit Verma",
    role: "Annual Subscriber",
    rating: 4,
    quote:
      "The annual plan paid for itself in two breakdowns. Every service since has been completely free and the invoices are clean.",
  },
];

export const partnerBenefits = [
  "Get matched with nearby customers automatically",
  "Set your own price, services and working area",
  "Go online or offline whenever it suits you",
  "Track your earnings and ratings in one dashboard",
];

export const faqs = [
  {
    q: "How quickly will a mechanic reach me?",
    a: "Most requests are accepted within a couple of minutes, and average arrival time is around 14 minutes in serviced areas. You'll see a live distance and ETA once your mechanic starts moving.",
  },
  {
    q: "Can I book a service for someone else?",
    a: "Yes. While requesting help, turn on \"Requesting this for someone else\" and enter their name, phone number and full address. The mechanic gets those details and goes directly to them.",
  },
  {
    q: "How does the subscription work?",
    a: "Pick a monthly or annual plan and every roadside service becomes free for as long as it's active. Your dashboard shows exactly how many days are remaining at all times.",
  },
  {
    q: "What if something goes wrong with a service?",
    a: "Raise a complaint or dispute from your dashboard. It goes straight to our admin team, and you can follow its status from Pending to In Progress to Resolved, along with any admin notes.",
  },
  {
    q: "How do I become a RoadRescue partner?",
    a: "Register as a mechanic, submit your verification details, and once an admin approves your profile you'll start appearing to nearby customers and receiving job requests.",
  },
];