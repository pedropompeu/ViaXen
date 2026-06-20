export function AppFooter() {
  return (
    <footer className="vx-footer" style={{ borderTop: '1px solid rgba(0,229,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--vx-success)', boxShadow: '0 0 6px var(--vx-success)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)' }}>OSRM Online</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--vx-success)', boxShadow: '0 0 6px var(--vx-success)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)' }}>ANTT Carregada</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--vx-text-muted)', letterSpacing: '0.05em' }}>
          © 2026 VIAXEN · Route Intelligence Platform
        </span>
        <a
          href="/privacidade.html"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--vx-text-muted)', letterSpacing: '0.05em', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--vx-cyan)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--vx-text-muted)')}
        >
          Privacidade
        </a>
      </div>
    </footer>
  )
}
