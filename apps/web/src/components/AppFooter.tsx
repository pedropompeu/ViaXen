import { Wifi, Database } from 'lucide-react'

export function AppFooter() {
  return (
    <footer className="vx-footer" style={{
      borderTop: '1px solid var(--vx-graphite)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Wifi size={11} strokeWidth={2} color="var(--vx-success)" />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: 'var(--vx-text-muted)',
          }}>
            OSRM Online
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Database size={11} strokeWidth={2} color="var(--vx-success)" />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: 'var(--vx-text-muted)',
          }}>
            ANTT Carregada
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--vx-text-muted)',
          letterSpacing: '0.05em',
        }}>
          © 2026 VIAXEN · Route Intelligence Platform
        </span>
        <a
          href="/privacidade.html"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--vx-text-muted)',
            letterSpacing: '0.05em',
            textDecoration: 'none',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--vx-cyan-dark)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--vx-text-muted)')}
        >
          Privacidade
        </a>
      </div>
    </footer>
  )
}
