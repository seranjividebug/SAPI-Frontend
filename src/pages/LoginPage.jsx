import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit() {
    if (!form.email || !form.password) {
      setError("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await login(form);
      const user = response.data?.user;
      
      // Role-based redirect
      if (user?.role === 1) {
        navigate('/admindashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-sapi-void flex flex-col items-center justify-center px-5 py-10">
      {/* Card */}
      <div className="w-full max-w-[400px] bg-gradient-to-br from-sapi-navy to-[#120822] border border-sapi-bronze/15 rounded-lg p-10 shadow-2xl">
        {/* Title */}
        <h1 className="font-serif text-[22px] font-normal text-sapi-parchment text-center tracking-wide uppercase mb-2.5">
          Sign In
        </h1>
        <p className="font-sans text-[11px] text-sapi-muted text-center tracking-wide uppercase mb-6">
          SAPI Assessment Portal  Secure Access
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-sapi-bronze/30 to-transparent mb-8" />

        {/* Form */}
        <div className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="font-sans text-[11px] tracking-wide uppercase text-sapi-muted mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full py-3.5 pl-5 pr-4.5 text-sm font-sans text-sapi-void bg-[#F0F0F5] border border-transparent rounded-md outline-none transition-all duration-150 focus:border-sapi-gold"
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-sans text-[11px] tracking-wide uppercase text-sapi-muted mb-2 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full py-3.5 pl-5 pr-4.5 text-sm font-sans text-sapi-void bg-[#F0F0F5] border border-transparent rounded-md outline-none transition-all duration-150 focus:border-sapi-gold"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-xs py-2.5 px-3.5 bg-red-500/10 border border-red-500/20 rounded text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 px-6 mt-2 font-sans text-xs font-medium tracking-wide uppercase text-sapi-void bg-sapi-gold border-none rounded-md cursor-pointer transition-all duration-150 hover:bg-[#B8862A] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>

          {/* Sign up link */}
          <div className="mt-5 text-center">
            <span className="font-sans text-[11px] text-sapi-muted">
              Don't have an account?{' '}
              <a href="/register" className="text-sapi-gold hover:text-sapi-paleGold transition-colors">
                Sign up
              </a>
            </span>
          </div>

       
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 font-sans text-[11px] text-sapi-muted tracking-wide text-center">
         2026 The Sovereign AI Power Index. Authorised access only.
      </p>
    </div>
  );
}
