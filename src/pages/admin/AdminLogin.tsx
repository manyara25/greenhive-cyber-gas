import { useState } from "react";
import type { FormEvent } from "react";
import { Lock, LogIn, ShieldCheck, User } from "lucide-react";


function AdminLogin() {
  

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("greenhive_admin_token", data.token);
      localStorage.setItem(
        "greenhive_admin",
        JSON.stringify(data.admin)
      );

      window.location.href = "/admin/dashboard";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-green-700 px-8 py-8 text-white text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
              <ShieldCheck size={34} />
            </div>

            <h1 className="text-2xl font-bold">
              GreenHive Admin
            </h1>

            <p className="mt-2 text-green-100">
              Secure administration panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Username
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={19} />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="border-t border-slate-100 px-8 py-4 text-center text-xs text-slate-500">
            GreenHive Cyber & Gas
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
