import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Common Header Component - Used across landing and other pages
 * @param {Object} props
 * @param {boolean} props.showProfile - Whether to show the profile icon
 * @param {React.ReactNode} props.rightContent - Custom content to show on the right side
 */
export function PageHeader({ showProfile = true, rightContent }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("sapi_current_user") || "{}");
  const email = currentUser.email || "";
  const firstLetter = email.charAt(0).toUpperCase() || "U";

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="border-b border-sapi-bronze py-1">
  <div className="max-w-container mx-auto px-8 flex items-center gap-4">
        <div className="font-sans text-[15px] font-normal tracking-extra-wide text-sapi-parchment uppercase leading-normal">
          The Sovereign AI<br />Power Index
        </div>
        <div className="ml-auto font-serif text-[10px] tracking-extra-wide text-sapi-muted uppercase border border-sapi-bronze px-2.5 py-1">
          For Government & Sovereign Institutions
        </div>
        {rightContent}
        {showProfile && (
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 text-sapi-parchment focus:outline-none"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-8 h-8 rounded-full bg-sapi-gold flex items-center justify-center text-sapi-void font-sans text-sm font-medium">
                {firstLetter}
              </div>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-[#0a0a12] border border-sapi-bronze rounded-md shadow-lg z-50">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-sapi-parchment hover:bg-sapi-navy transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default PageHeader;
