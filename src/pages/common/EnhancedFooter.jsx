import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Request Introduction" },
];

const socialLinks = [
  // { href: "https://x.com/thesaipi", label: "X" },
  { href: "https://www.linkedin.com/company/the-sovereign-ai-power-index/", label: "LinkedIn" },
];

export function EnhancedFooter() {
  const location = useLocation();

  const handleNavClick = (e, href) => {
    if (location.pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-sapi-bronze bg-[#0a0a12]">
      <div className="max-w-container mx-auto grid gap-10 px-8 py-16 md:grid-cols-[1.2fr_1fr_0.9fr] md:py-20">
        <div className="space-y-4">
          <p className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted">Navigation</p>
          <div className="grid gap-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                className="font-sans inline-flex min-h-11 items-center text-[0.72rem] uppercase tracking-[0.22em] text-sapi-parchment transition-colors duration-200 hover:text-sapi-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sapi-gold"
                to={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted">Contact</p>
          <div className="grid gap-4 text-[0.95rem] leading-8 text-sapi-muted">
            <div className="grid gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  className="font-sans inline-flex min-h-11 items-center text-[0.72rem] uppercase tracking-[0.22em] text-sapi-parchment transition-colors duration-200 hover:text-sapi-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sapi-gold"
                  href={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted">Legal</p>
          <div className="grid gap-4">
            <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-sapi-muted">
              SAPI is an independent UK sovereign AI intelligence company.
            </p>
            <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-sapi-muted">
              © 2026 THE SOVEREIGN AI POWER INDEX
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default EnhancedFooter;
