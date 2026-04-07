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
    <div style={{
      width: 220, flexShrink: 0,
      background: '#0F0830',
      display: 'flex', flexDirection: 'column',
      height: '100%',
      borderRight: '0.5px solid #1E1650',
    }}>
      <div style={{ padding: '18px 16px 16px', borderBottom: '0.5px solid #1E1650' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, background: '#C9963A', borderRadius: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#06030E', fontFamily: 'Georgia, serif', fontSize: 16, flexShrink: 0,
          }}>S</div>
          <div>
            <div style={{ color: '#FBF5E6', fontSize: 13, fontWeight: 500, lineHeight: 1.25 }}>SAPI</div>
            <div style={{ color: '#9880B0', fontSize: 9.5, letterSpacing: '0.09em', textTransform: 'uppercase', lineHeight: 1 }}>Admin Panel</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, paddingTop: 8 }}>
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
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', padding: '9px 16px',
                background: active ? '#1A1540' : 'transparent',
                border: 'none',
                borderLeft: `3px solid ${active ? '#C9963A' : 'transparent'}`,
                color: active ? '#EDD98A' : '#FBF5E6',
                fontSize: 13, cursor: 'pointer', textAlign: 'left',
                fontFamily: 'system-ui, sans-serif',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 13, opacity: active ? 1 : 0.55, width: 16 }}>{item.glyph}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '14px 16px', borderTop: '0.5px solid #1E1650' }}>
        <div style={{ color: '#6B5E80', fontSize: 11, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {userEmail}
        </div>
        <button
          onClick={onSignOut}
          style={{ background: 'transparent', border: 'none', color: '#C9963A', fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: 'system-ui, sans-serif' }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
