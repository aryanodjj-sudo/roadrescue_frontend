// ADMIN MOCK DATA
// -----------------------------------------------------------------------
// Real backend endpoints now exist for users, mechanics, verification,
// service requests, platform totals, and complaints/disputes
// (GET/PUT /api/admin/*) — those admin sections read live data and no
// longer use this file.
//
// What's left here is mock data for platform features that genuinely
// don't have a backend yet: per-mechanic customer reviews list (only
// GET /api/reviews/mechanic/:id exists, not a platform-wide reviews
// endpoint) and a monthly revenue breakdown (/api/admin/reports only
// returns a running total, not a month-by-month series). Each is clearly
// labeled "Mock data" in its section.

export const mockReviews = [
  { id: "rv1", mechanicName: "Rajesh Auto Works", customerName: "Aditya Sharma", rating: 5, comment: "Reached in 8 minutes, fixed the battery in no time.", date: "2026-08-12" },
  { id: "rv2", mechanicName: "QuickFix Garage", customerName: "Rohit Verma", rating: 4, comment: "Good service, slightly delayed ETA.", date: "2026-08-18" },
  { id: "rv3", mechanicName: "Rajesh Auto Works", customerName: "Divya Menon", rating: 5, comment: "Very professional and polite.", date: "2026-08-25" },
  { id: "rv4", mechanicName: "SpeedTow Services", customerName: "Priya Nair", rating: 3, comment: "Towing took longer than expected.", date: "2026-08-30" },
];

// Simple monthly revenue mock (platform commission), used for the Reports
// & Revenue section since no charting library is installed.
export const mockRevenueByMonth = [
  { month: "Mar", revenue: 42000 },
  { month: "Apr", revenue: 51500 },
  { month: "May", revenue: 47800 },
  { month: "Jun", revenue: 63200 },
  { month: "Jul", revenue: 71000 },
  { month: "Aug", revenue: 68500 },
];