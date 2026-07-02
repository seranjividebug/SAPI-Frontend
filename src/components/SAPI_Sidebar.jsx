import React from 'react';

const NAV_ITEMS = [
  { key: 'dashboard',      label: 'Dashboard',        glyph: '⊞' },
  { key: 'submissions',    label: 'Assessments',       glyph: '≡' },
  // { key: 'questionEditor', label: 'Question Editor',   glyph: '✎' },
  { key: 'userMgmt',       label: 'Users & Settings',  glyph: '⚙' },
];

export default function Sidebar({ adminPage, setAdminPage, onSignOut }) {
  // Get user email from localStorage
  const userEmail = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('sapi_current_user') || '{}');
      return user.email || 'admin@sapi.ai';
    } catch {
      return 'admin@sapi.ai';
    }
  })();
  return (
    <div className="w-[220px] flex-shrink-0 bg-sapi-navy flex flex-col h-full border-r border-[#1E1650]/50">
      <div className="py-4.5 px-4 pb-4 border-b border-[#1E1650]/50">
        <div className="flex items-center gap-2 ml-4 mt-5">
          <div className="w-7 h-7 bg-sapi-gold rounded flex items-center justify-center text-sapi-void font-serif text-base flex-shrink-0">S</div>
          <div className="pl-1">
            <div className="text-sapi-parchment text-[13px] font-medium leading-[1.25]">SAPI</div>
            <div className="text-sapi-muted text-[9.5px] tracking-[0.09em] uppercase leading-none pl-0.1">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 pt-2">
        {NAV_ITEMS.map(item => {
          const active = adminPage === item.key
            || (adminPage === 'submissionDetail' && item.key === 'submissions')
            || (adminPage === 'leadDetail' && item.key === 'leads');
          return (
            <button
              key={item.key}
              onClick={() => {
                setAdminPage(item.key);
              }}
              className="flex items-center gap-2 w-full py-2 px-4 border-none text-left font-sans text-[13px] cursor-pointer transition-colors"
              style={{
                background: active ? '#C9963A20' : 'transparent',
                borderLeft: `3px solid ${active ? '#C9963A' : 'transparent'}`,
                color: active ? '#C9963A' : '#FBF5E6',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span className="text-[13px] w-4" style={{ opacity: active ? 1 : 0.55 }}>{item.glyph}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="py-3.5 px-4 border-t border-[#1E1650]/50">
        <div className="text-[#6B5E80] text-[11px] mb-2 truncate">
          {userEmail}
        </div>
        <button
          onClick={onSignOut}
          className="bg-transparent border-none text-sapi-gold text-xs cursor-pointer p-0 font-sans"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
