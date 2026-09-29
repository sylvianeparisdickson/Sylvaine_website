"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/routing";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with:", email);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin/orders");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef] p-4 md:p-8 flex items-center justify-center">
      <div className="bg-white p-6 md:p-8 max-w-md w-full">
        <h1 className="font-serif italic text-[28px] text-[#1a1816] mb-2 text-center">
          Admin Login
        </h1>
        <p className="text-[11px] tracking-[.14em] uppercase text-[#9a9188] mb-6 text-center">
          Sylviane Paris — Administration
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-transparent border border-black/20 text-[14px] text-[#1a1816] outline-none focus:border-[#1a1816]"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-transparent border border-black/20 text-[14px] text-[#1a1816] outline-none focus:border-[#1a1816]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[11px] text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#1a1816] text-white text-[10px] tracking-[.18em] uppercase hover:bg-[#3a3836] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
