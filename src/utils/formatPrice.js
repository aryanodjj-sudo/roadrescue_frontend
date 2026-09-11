import { CURRENCY_SYMBOL } from "./constants";

// Plain "₹499" — no thousands separator. Matches how MechanicCard,
// MechanicDashboard, and Invoice.jsx currently display per-visit prices
// and small line items.
export function formatPrice(amount) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return `${CURRENCY_SYMBOL}0`;
  }
  return `${CURRENCY_SYMBOL}${amount}`;
}

// "₹1,24,500" — Indian digit grouping with thousands separators. Matches
// how AdminOverview.jsx and AdminReportsRevenue.jsx already format
// totalRevenue via toLocaleString("en-IN"), just as a reusable function
// instead of every admin section repeating the same call.
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return `${CURRENCY_SYMBOL}0`;
  }
  return `${CURRENCY_SYMBOL}${Number(amount).toLocaleString("en-IN")}`;
}