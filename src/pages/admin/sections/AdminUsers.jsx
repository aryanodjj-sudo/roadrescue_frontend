import { useState, useEffect, useCallback } from "react";
import { FaSearch, FaCarSide, FaClipboardList, FaUsers, FaUserCheck, FaUserSlash, FaUserPlus } from "react-icons/fa";
import StatCard from "../../../components/admin/StatCard";
import api from "../../../utils/api";
import { formatDate } from "../../../utils/formatDate";

function StatusPill({ status }) {
  const styles =
    status === "active"
      ? "bg-green-50 text-green-600"
      : "bg-red-50 text-red-500";
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles}`}>
      {status === "active" ? "Active" : "Suspended"}
    </span>
  );
}

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users);
    } catch (err) {
      setError(err.message || "Couldn't load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = users.filter((u) => u.status === "active").length;
  const suspendedCount = users.filter((u) => u.status !== "active").length;
  const newThisMonth = users.filter((u) => {
    const created = new Date(u.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        {loading ? "Loading..." : `${filtered.length} of ${users.length} registered users`}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FaUsers} label="Total Users" value={users.length} tone="primary" />
        <StatCard icon={FaUserCheck} label="Active" value={activeCount} tone="green" />
        <StatCard icon={FaUserSlash} label="Suspended" value={suspendedCount} tone="red" />
        <StatCard icon={FaUserPlus} label="New This Month" value={newThisMonth} tone="accent" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <p className="text-slate-500 text-sm">Loading users...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-dashed border-red-200 p-14 text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={loadUsers}
            className="text-sm font-semibold text-primary-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-14 text-center">
          <p className="text-slate-500 text-sm">No users match your filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Name</th>
                <th className="text-left px-5 py-3 font-medium">Contact</th>
                <th className="text-left px-5 py-3 font-medium">Registered</th>
                <th className="text-left px-5 py-3 font-medium">Vehicles</th>
                <th className="text-left px-5 py-3 font-medium">Requests</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-900">{u.name}</td>
                  <td className="px-5 py-4 text-slate-500">
                    <p>{u.email}</p>
                    <p className="text-xs text-slate-400">{u.phone || "—"}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <FaCarSide className="text-slate-400" /> {u.vehicleCount}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <FaClipboardList className="text-slate-400" /> {u.requestCount}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={u.status} />
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

export default AdminUsers;