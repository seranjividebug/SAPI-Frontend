/**
 * Common Footer Component - Used across all pages
 */
export function PageFooter() {
  return (
    <footer className="border-t border-sapi-bronze">
      <div className="max-w-container mx-auto px-8 py-6 flex justify-between items-center flex-wrap gap-2">
        <div className="font-sans text-[11px] text-sapi-muted tracking-extra-wide opacity-60">
          © 2026 The Sovereign AI Power Index (SAPI). All rights reserved.
        </div>
        <div className="font-sans text-[11px] text-sapi-muted tracking-extra-wide opacity-60">
          SAPI · Tier 1 Free Self-Assessment
        </div>
      </div>
    </footer>
  );
}

export default PageFooter;
