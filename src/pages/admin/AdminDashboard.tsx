import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  LogOut,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

type ServiceRequest = {
  id: number;
  name: string;
  phone: string;
  service: string;
  message: string | null;
  status: "New" | "In Progress" | "Completed" | "Cancelled";
  created_at: string;
};

function AdminDashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [updatingId, setUpdatingId] = useState<number | null>(null);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("greenhive_admin_token");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("greenhive_admin_token");
          localStorage.removeItem("greenhive_admin");
          window.location.href = "/admin/login";
          return;
        }

        throw new Error(data.message || "Failed to load requests");
      }

      setRequests(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (
    id: number,
    status: ServiceRequest["status"]
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      const token = localStorage.getItem("greenhive_admin_token");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/requests/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("greenhive_admin_token");
          localStorage.removeItem("greenhive_admin");
          window.location.href = "/admin/login";
          return;
        }

        throw new Error(
          data.message || "Failed to update status"
        );
      }

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === id
            ? { ...request, status }
            : request
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("greenhive_admin_token");
    localStorage.removeItem("greenhive_admin");
    window.location.href = "/admin/login";
  };
const filteredRequests = useMemo(() => {
  const searchText = search.trim().toLowerCase();

  return requests.filter((request) => {
    const matchesSearch =
      !searchText ||
      request.name.toLowerCase().includes(searchText) ||
      request.phone.toLowerCase().includes(searchText) ||
      request.service.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [requests, search, statusFilter]);
  const newRequests = requests.filter(
    (request) => request.status === "New"
  ).length;

  const inProgress = requests.filter(
    (request) => request.status === "In Progress"
  ).length;

  const completed = requests.filter(
    (request) => request.status === "Completed"
  ).length;

  const cancelled = requests.filter(
    (request) => request.status === "Cancelled"
  ).length;
<div className="mb-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
  <div className="grid gap-4 md:grid-cols-2">

    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        Search Requests
      </label>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Name, phone or service..."
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        Filter by Status
      </label>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
      >
        <option value="All">All Requests</option>
        <option value="New">New</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>

  </div>
</div>
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-green-700 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                GreenHive Admin
              </h1>
              <p className="text-sm text-green-100">
                Service Request Management
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Dashboard
            </h2>

            <p className="mt-1 text-slate-500">
              Manage customer requests from GreenHive Cyber & Gas.
            </p>
          </div>

          <button
            onClick={fetchRequests}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                New
              </p>
              <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                <Clock size={20} />
              </div>
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-800">
              {newRequests}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                In Progress
              </p>
              <div className="rounded-lg bg-yellow-100 p-2 text-yellow-700">
                <Clock size={20} />
              </div>
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-800">
              {inProgress}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Completed
              </p>
              <div className="rounded-lg bg-green-100 p-2 text-green-700">
                <CheckCircle size={20} />
              </div>
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-800">
              {completed}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Cancelled
              </p>
              <div className="rounded-lg bg-red-100 p-2 text-red-700">
                <XCircle size={20} />
              </div>
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-800">
              {cancelled}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-bold text-slate-800">
              Customer Requests
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {requests.length} request
              {requests.length === 1 ? "" : "s"} received
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-slate-500">
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              No customer requests yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Service
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Message
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {request.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {request.phone}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {request.service}
                      </td>

                      <td className="max-w-xs px-6 py-4 text-sm text-slate-500">
                        {request.message || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={request.status}
                          disabled={updatingId === request.id}
                          onChange={(e) =>
                            updateStatus(
                              request.id,
                              e.target.value as ServiceRequest["status"]
                            )
                          }
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="New">New</option>
                          <option value="In Progress">
                            In Progress
                          </option>
                          <option value="Completed">
                            Completed
                          </option>
                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(
                          request.created_at
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;