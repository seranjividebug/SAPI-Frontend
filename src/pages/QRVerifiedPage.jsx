import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

export default function QRVerifiedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  // Route to the correct landing area based on the verified user's role.
  // Admins (role 1) go to the admin dashboard; regular users (role 2) go to /home.
  function handleBegin() {
    const user = getCurrentUser();
    if (user?.role === 1) {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  }

  return (
    <div className="min-h-screen bg-sapi-void flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[480px] bg-sapi-navy border border-sapi-bronze rounded-md overflow-hidden shadow-2xl">
        <div className="px-10 pt-12 pb-12 text-center">
          {/* Success check */}
          <div className="w-16 h-16 rounded-full bg-sapi-emerald/10 border border-sapi-emerald/30 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M6 14L11 19L22 9"
                stroke="#28A868"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="font-sans text-[10px] tracking-super-wide uppercase text-sapi-emerald mb-2.5">
            Identity Verified
          </div>
          <h1 className="font-serif text-[22px] font-normal text-sapi-parchment tracking-wide mb-2.5">
            Access granted.
          </h1>
          <p className="font-sans text-[13px] text-sapi-muted leading-relaxed mb-8 max-w-[320px] mx-auto">
            Your institutional identity has been confirmed. You may now proceed to the
            Sovereign AI Power Index assessment.
          </p>

          <button
            onClick={handleBegin}
            className="w-full max-w-[320px] mx-auto block bg-sapi-gold text-sapi-void border-none py-3.5 px-12 font-sans text-[11px] font-medium tracking-super-wide uppercase cursor-pointer rounded-sm transition-colors duration-150 hover:bg-[#B8862A]"
          >
            Begin Assessment →
          </button>

          <button
            onClick={() => navigate("/home", { state: { activeTab: "powerarc" } })}
            className="w-full max-w-[320px] mx-auto block mt-3 bg-transparent text-sapi-gold border border-sapi-gold py-3.5 px-12 font-sans text-[11px] font-medium tracking-super-wide uppercase cursor-pointer rounded-sm transition-colors duration-150 hover:bg-sapi-gold hover:text-sapi-void"
          >
            Power Arc →
          </button>

          <div className="mt-6 py-3.5 px-4 bg-sapi-muted/5 border border-sapi-bronze rounded-sm max-w-[320px] mx-auto text-left">
            <div className="font-sans text-[10px] tracking-extra-wide uppercase text-sapi-muted mb-1.5">
              Session information
            </div>
            <div className="font-sans text-[12px] text-sapi-muted leading-relaxed">
              Verified as: <span className="text-sapi-paleGold">{email}</span>
              <br />
              Session valid for 24 hours. Access is logged for security.
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
