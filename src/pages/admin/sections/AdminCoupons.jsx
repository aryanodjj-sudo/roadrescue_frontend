import { useState, useEffect, useCallback } from "react";
import { FaTag, FaPlus, FaToggleOn, FaToggleOff, FaTrash, FaCheckCircle, FaTicketAlt } from "react-icons/fa";
import Button from "../../../components/common/Button";
import StatCard from "../../../components/admin/StatCard";
import api from "../../../utils/api";
import { formatDateTime } from "../../../utils/formatDate";

const EMPTY_FORM = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscount: "",
  minOrderValue: "",
  expiryDate: "",
  usageLimit: "",
};

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/coupons");
      setCoupons(data.coupons);
    } catch (err) {
      setError(err.message || "Couldn't load coupons.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await api.post("/coupons", {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
        expiryDate: form.expiryDate || null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(err.message || "Could not create coupon.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await api.put(`/coupons/${id}/toggle`);
      setCoupons((prev) => prev.map((c) => (c._id === id ? data.coupon : c)));
    } catch (err) {
      setError(err.message || "Could not update coupon.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon permanently?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.message || "Could not delete coupon.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Coupons</h1>
        <Button variant="primary" onClick={() => setShowForm((s) => !s)}>
          <FaPlus className="text-sm" /> {showForm ? "Close" : "New Coupon"}
        </Button>
      </div>
      <p className="text-slate-500 text-sm mb-6">Create discount codes customers can apply at checkout.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FaTag} label="Total Coupons" value={coupons.length} tone="primary" />
        <StatCard
          icon={FaCheckCircle}
          label="Active"
          value={coupons.filter((c) => c.isActive).length}
          tone="green"
        />
        <StatCard
          icon={FaToggleOff}
          label="Disabled"
          value={coupons.filter((c) => !c.isActive).length}
          tone="red"
        />
        <StatCard
          icon={FaTicketAlt}
          label="Total Redemptions"
          value={coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}
          tone="accent"
        />
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Code</label>
              <input
                type="text"
                name="code"
                required
                value={form.code}
                onChange={handleChange}
                placeholder="WELCOME50"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Discount Value {form.discountType === "percentage" ? "(%)" : "(₹)"}
              </label>
              <input
                type="number"
                name="discountValue"
                required
                min="1"
                value={form.discountValue}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            {form.discountType === "percentage" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Discount (₹)</label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={form.maxDiscount}
                  onChange={handleChange}
                  placeholder="optional"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Min Order (₹)</label>
              <input
                type="number"
                name="minOrderValue"
                value={form.minOrderValue}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usage Limit</label>
              <input
                type="number"
                name="usageLimit"
                value={form.usageLimit}
                onChange={handleChange}
                placeholder="unlimited"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {formError && <p className="text-red-600 text-sm">{formError}</p>}

          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Creating..." : "Create Coupon"}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center text-sm text-slate-500">
          Loading...
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <FaTag className="text-4xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm">No coupons created yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Code</th>
                <th className="text-left px-5 py-3 font-medium">Discount</th>
                <th className="text-left px-5 py-3 font-medium">Min Order</th>
                <th className="text-left px-5 py-3 font-medium">Usage</th>
                <th className="text-left px-5 py-3 font-medium">Expiry</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">{c.code}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}
                    {c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ""}
                  </td>
                  <td className="px-5 py-4 text-slate-500">₹{c.minOrderValue}</td>
                  <td className="px-5 py-4 text-slate-500">
                    {c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : " / ∞"}
                  </td>
                  <td className="px-5 py-4 text-slate-500">{c.expiryDate ? formatDateTime(c.expiryDate) : "No expiry"}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        c.isActive ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {c.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleToggle(c._id)} className="text-primary-600" title="Toggle active">
                        {c.isActive ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg text-slate-400" />}
                      </button>
                      <button onClick={() => handleDelete(c._id)} className="text-red-500" title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminCoupons;