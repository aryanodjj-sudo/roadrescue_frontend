// ADMIN MOCK DATA
// -----------------------------------------------------------------------
// Real backend endpoints now exist for users, mechanics, verification,
// service requests, and platform totals (GET/PUT /api/admin/*) — those
// admin sections read live data and no longer use this file.
//
// What's left here is mock data for platform features that genuinely
// don't have a backend yet: per-mechanic customer reviews list (only
// GET /api/reviews/mechanic/:id exists, not a platform-wide reviews
// endpoint), complaints, disputes, and a monthly revenue breakdown
// (no Complaint/Dispute model, and /api/admin/reports only returns a
// running total, not a month-by-month series). Each is clearly labeled
// "Mock data" in its section.

export const mockReviews = [
  { id: "rv1", mechanicName: "Rajesh Auto Works", customerName: "Aditya Sharma", rating: 5, comment: "Reached in 8 minutes, fixed the battery in no time.", date: "2026-08-12" },
  { id: "rv2", mechanicName: "QuickFix Garage", customerName: "Rohit Verma", rating: 4, comment: "Good service, slightly delayed ETA.", date: "2026-08-18" },
  { id: "rv3", mechanicName: "Rajesh Auto Works", customerName: "Divya Menon", rating: 5, comment: "Very professional and polite.", date: "2026-08-25" },
  { id: "rv4", mechanicName: "SpeedTow Services", customerName: "Priya Nair", rating: 3, comment: "Towing took longer than expected.", date: "2026-08-30" },
];

export const mockComplaints = [
  { id: "cp1", raisedBy: "Priya Nair", against: "SpeedTow Services", subject: "Mechanic arrived 40 minutes late", status: "Open", date: "2026-08-30" },
  { id: "cp2", raisedBy: "Imran Sheikh", against: "CityCare Motors", subject: "Overcharged for fuel delivery", status: "Under Review", date: "2026-08-22" },
  { id: "cp3", raisedBy: "Rohit Verma", against: "QuickFix Garage", subject: "Unprofessional behavior", status: "Resolved", date: "2026-07-30" },
];

export const mockDisputes = [
  { id: "ds1", requestId: "req_mock_1042", raisedBy: "Aditya Sharma", type: "Payment Dispute", description: "Charged more than the quoted estimate.", status: "Open", date: "2026-08-29" },
  { id: "ds2", requestId: "req_mock_1030", raisedBy: "Highway Heroes", type: "Service Dispute", description: "Customer refused to pay after service completion.", status: "Escalated", date: "2026-08-24" },
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