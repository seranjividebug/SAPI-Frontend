import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendQrLoginCode } from "../services/authService";

export default function QRLoginEmailPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode() {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendQrLoginCode(email);
      // Code sent — carry the email forward to the OTP screen
      navigate("/qr-login/verify", { state: { email } });
    } catch (err) {
      setError(friendlyError(err.message));
    } finally {
      setLoading(false);
    }
  }

  // Translate raw backend/SES errors into a friendly, non-technical message.
  function friendlyError(raw) {
    const msg = (raw || "").toLowerCase();

    if (msg.includes("not verified") || msg.includes("message rejected") || msg.includes("554")) {
      return "We couldn't send a code to this email address. Please check that it's correct, or try a different institutional email.";
    }
    if (msg.includes("invalid") && msg.includes("email")) {
      return "Please enter a valid email address.";
    }
    if (msg.includes("rate") || msg.includes("too many") || msg.includes("429")) {
      return "Too many attempts. Please wait a moment before requesting another code.";
    }
    if (msg.includes("network") || msg.includes("failed to fetch")) {
      return "We're having trouble connecting. Please check your internet connection and try again.";
    }

    return "We couldn't send your verification code right now. Please try again in a moment.";
  }

  return (
    <div className="min-h-screen bg-sapi-void flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[480px] bg-sapi-navy border border-sapi-bronze rounded-md overflow-hidden shadow-2xl">
        {/* Back link */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 font-sans text-[10px] tracking-super-wide uppercase text-sapi-muted hover:text-sapi-gold transition-colors duration-150 bg-transparent border-none cursor-pointer px-5 pt-4"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Back to sign in
        </button>

        <div className="px-10 pt-6 pb-10">
          <div className="font-sans text-[10px] tracking-super-wide uppercase text-sapi-gold mb-2.5">
            Quick Access
          </div>
          <h1 className="font-serif text-[20px] font-normal text-sapi-parchment tracking-wide mb-2.5">
            Verify your identity
          </h1>
          <p className="font-sans text-[13px] text-sapi-muted leading-relaxed mb-7">
            Enter the email address associated with your institution. We'll send a
            one-time verification code — no password required.
          </p>

          {/* Email field */}
          <div className="mb-2">
            <label className="block font-sans text-[10px] tracking-super-wide uppercase text-sapi-muted mb-2">
              Official Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
              placeholder="name@ministry.gov"
              className="w-full bg-sapi-midnight border border-sapi-bronze border-b-2 text-sapi-parchment py-3 px-4 text-sm tracking-wide outline-none rounded-sm transition-colors duration-150 focus:border-sapi-gold"
            />
            <div className="font-sans text-[11px] text-sapi-muted mt-2 leading-relaxed">
              Government-issued email addresses are processed faster.
            </div>
          </div>

          {error && (
            <div className="text-sapi-crimson text-[11px] tracking-wide uppercase mt-3 py-2 px-3 bg-sapi-crimson/5 border border-sapi-crimson/20 rounded-sm">
              {error}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-sapi-bronze my-6" />

          <button
            onClick={handleSendCode}
            disabled={loading}
            className="w-full bg-sapi-gold text-sapi-void border-none py-3.5 px-12 font-sans text-[11px] font-medium tracking-super-wide uppercase cursor-pointer rounded-sm transition-colors duration-150 hover:bg-[#B8862A] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
          <div className="font-sans text-[10px] text-sapi-muted text-center tracking-wide mt-3 opacity-60 leading-relaxed">
            A 6-digit code will be sent to your address. Codes expire after 10 minutes.
          </div>

          <div className="mt-6 py-3.5 px-4 bg-sapi-muted/5 border border-sapi-bronze rounded-sm">
            <div className="font-sans text-[10px] tracking-extra-wide uppercase text-sapi-muted mb-1.5">
              Why email verification?
            </div>
            <div className="font-sans text-[12px] text-sapi-muted leading-relaxed">
              SAPI uses institutional email addresses to validate access. This ensures the
              platform remains restricted to verified government officials and advisory bodies.
            </div>
          </div>
        </div>

        <div className="border-t border-sapi-bronze py-3.5 px-5">
          <div className="font-sans text-[10px] text-sapi-muted tracking-wide text-center opacity-50">
            2026 · The Sovereign AI Power Index · Authorised access only
          </div>
        </div>
      </div>
    </div>
  );
}
