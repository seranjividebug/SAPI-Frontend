import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendQrLoginCode, verifyQrLoginCode } from "../services/authService";

export default function QRLoginOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const inputsRef = useRef([]);

  function handleChange(index, value) {
    const digit = value.replace(/\D/, "");
    if (!digit && value !== "") return;
    const next = [...digits];
    next[index] = digit.slice(-1);
    setDigits(next);
    setError("");
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = ["", "", "", "", "", ""];
    pasted.split("").forEach((d, i) => (next[i] = d));
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerify() {
    const code = digits.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits of your verification code.");
      // focus the first empty box
      const firstEmpty = digits.findIndex((d) => !d);
      if (firstEmpty !== -1) inputsRef.current[firstEmpty]?.focus();
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Verifies the code; on success stores the real JWT + user (see authService)
      await verifyQrLoginCode(email, code);
      navigate("/qr-login/success", { state: { email } });
    } catch (err) {
      setError(err.message || "Verification failed");
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (email === "your email") return;
    setError("");
    setResendMsg("");
    try {
      await sendQrLoginCode(email);
      setResendMsg("A new code has been sent to your email.");
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  }

  return (
    <div className="min-h-screen bg-sapi-void flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[480px] bg-sapi-navy border border-sapi-bronze rounded-md overflow-hidden shadow-2xl">
        {/* Back link */}
        <button
          onClick={() => navigate("/qr-login")}
          className="flex items-center gap-1.5 font-sans text-[10px] tracking-super-wide uppercase text-sapi-muted hover:text-sapi-gold transition-colors duration-150 bg-transparent border-none cursor-pointer px-5 pt-4"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Change email
        </button>

        <div className="px-10 pt-6 pb-10">
          <div className="font-sans text-[10px] tracking-super-wide uppercase text-sapi-gold mb-2.5">
            Step 2 of 2
          </div>
          <h1 className="font-serif text-[20px] font-normal text-sapi-parchment tracking-wide mb-2.5">
            Enter your verification code
          </h1>

          {/* Status bar */}
          <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-sapi-emerald/5 border border-sapi-emerald/20 rounded-sm mb-5">
            <span className="w-[7px] h-[7px] rounded-full bg-sapi-emerald flex-shrink-0" />
            <span className="font-sans text-[11px] text-sapi-emerald tracking-wide">
              Code sent to {email}
            </span>
          </div>

          <p className="font-sans text-[13px] text-sapi-muted leading-relaxed mb-6">
            Enter the 6-digit code from your email. This code is valid for 10 minutes.
          </p>

          {/* OTP inputs */}
          <div className="mb-6">
            <label className="block text-center font-sans text-[10px] tracking-super-wide uppercase text-sapi-muted mb-2">
              Verification Code
            </label>
            <div className="flex gap-2.5 justify-center">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className={`w-[52px] h-[58px] bg-sapi-midnight border border-sapi-bronze border-b-2 text-sapi-paleGold font-serif text-[22px] text-center outline-none rounded-sm transition-colors duration-150 focus:border-sapi-gold ${
                    digit ? "border-sapi-gold/40" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="py-3 px-3.5 bg-sapi-crimson/5 border border-sapi-crimson/20 rounded-sm mb-4">
              <div className="font-sans text-[11px] text-sapi-crimson tracking-wide">
                {error}
              </div>
            </div>
          )}

          {resendMsg && (
            <div className="py-3 px-3.5 bg-sapi-emerald/5 border border-sapi-emerald/20 rounded-sm mb-4">
              <div className="font-sans text-[11px] text-sapi-emerald tracking-wide">
                {resendMsg}
              </div>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-sapi-gold text-sapi-void border-none py-3.5 px-12 font-sans text-[11px] font-medium tracking-super-wide uppercase cursor-pointer rounded-sm transition-colors duration-150 hover:bg-[#B8862A] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify & Access Assessment"}
          </button>

          <div className="flex justify-center gap-1.5 items-center mt-3.5">
            <span className="font-sans text-[11px] text-sapi-muted tracking-wide">
              Didn't receive it?
            </span>
            <span
              onClick={handleResend}
              className="font-sans text-[11px] text-sapi-gold tracking-wide underline cursor-pointer"
            >
              Resend code
            </span>
            <span className="font-sans text-[11px] text-sapi-muted tracking-wide">·</span>
            <span
              onClick={() => navigate("/qr-login")}
              className="font-sans text-[11px] text-sapi-gold tracking-wide underline cursor-pointer"
            >
              Try another email
            </span>
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
