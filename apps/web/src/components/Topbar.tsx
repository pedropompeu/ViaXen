interface TopbarProps {
  historyCount: number
  onExport: () => void
}

function VNodeIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 52 52" fill="none">
      <rect x="1" y="1" width="50" height="50" rx="14"
        fill="#0D1117" stroke="rgba(0,229,255,0.3)" strokeWidth="1"/>
      <path d="M12 14 L22 38 L26 30 L30 38 L40 14"
        stroke="#00E5FF" strokeWidth="3.5"
        strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="26" cy="30" r="3" fill="#00E5FF"/>
      <line x1="34" y1="23" x2="44" y2="23"
        stroke="rgba(0,229,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="36" y1="27" x2="44" y2="27"
        stroke="rgba(0,229,255,0.2)" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
}

export function Topbar({ historyCount, onExport }: TopbarProps) {
  return (
    <header className="vx-topbar" style={{
      height: 52, flexShrink: 0,
      background: 'var(--vx-surface)',
      borderBottom: '1px solid var(--vx-cyan-border)',
      boxShadow: '0 1px 0 0 rgba(0,229,255,0.08)',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <VNodeIcon />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1 }}>
          <span style={{ color: 'var(--vx-cyan)' }}>V</span>
          <span style={{ color: 'var(--vx-text-primary)' }}>IAXEN</span>
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase' as const,
        color: 'var(--vx-cyan)', background: 'rgba(0,229,255,0.1)',
        border: '1px solid rgba(0,229,255,0.2)', padding: '3px 8px', borderRadius: 6,
      }}>Route Intelligence</div>
      <div style={{ flex: 1 }} />
      <div className="vx-topbar-session" style={{ flexDirection: 'column' as const, alignItems: 'flex-end', marginRight: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)' }}>Sessão</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--vx-cyan)' }}>{historyCount} percursos</span>
      </div>
      <button
        onClick={onExport}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent', color: 'var(--vx-text-primary)',
          border: '1px solid rgba(0,229,255,0.25)',
          fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '0.02em',
          padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
          transition: 'background 150ms, border-color 150ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,229,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span className="vx-topbar-export-label">Exportar CSV</span>
      </button>
    </header>
  )
}
