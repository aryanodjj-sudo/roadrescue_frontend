// Where a logged-in user's own dashboard lives, based on their role.
// Shared by Navbar (the "Dashboard" link), Home (the CTA buttons), and
// ProtectedRoute (redirecting an authenticated-but-wrong-role visitor
// somewhere useful instead of a blank bounce to "/").
export function getDashboardPath(role) {
  if (role === "mechanic") return "/mechanic/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/dashboard";
}