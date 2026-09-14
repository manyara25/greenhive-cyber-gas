import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Search,
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

function RequestStatus() {
  const [reference, setReference] = useState("");
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setRequest(null);

    const cleanedReference = reference
      .trim()
      .toUpperCase()
      .replace("GH-", "");

    if (!cleanedReference || isNaN(Number(cleanedReference))) {
      setError("Please enter a valid reference such as GH-0001.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/requests/${Number(cleanedReference)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Request could not be found."
        );
      }

      setRequest(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to find your request."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!request) return null;

    if (request.status === "Completed") {
      return <CheckCircle size={28} />;
    }

    if (request.status === "Cancelled") {
      return <XCircle size={28} />;
    }

    return <Clock size={28} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">

        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-green-700"
        >
          <ArrowLeft size={17} />
          Back to GreenHive
        </a>

        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-10">

          <p className="font-bold uppercase tracking-widest text-green-600">
            GreenHive Cyber & Gas
          </p>

          <h1 className="mt-3 text-3xl font-black md:text-4xl">
            Track Your Request
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Enter your request reference to check the latest status.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="e.g. GH-0001"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search size={18} />
              {loading ? "Checking..." : "Check Status"}
            </button>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {request && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">

              <div className="bg-green-700 px-6 py-5 text-white">
                <p className="text-sm text-green-100">
                  Request Reference
                </p>

                <p className="mt-1 text-2xl font-black">
                  GH-{String(request.id).padStart(4, "0")}
                </p>
              </div>

              <div className="space-y-5 p-6">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Customer
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {request.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Service
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {request.service}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-bold text-slate-700">
                    {getStatusIcon()}
                    {request.status}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {new Date(request.created_at).toLocaleString()}
                  </p>
                </div>

                {request.message && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Message
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {request.message}
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Need help? Contact GreenHive Cyber & Gas directly.
            </p>

            <p className="mt-2 font-bold text-green-700">
              0796 967 815 / 0738 892 946
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RequestStatus;