import { Download } from 'lucide-react'
import { AuthButton } from './AuthButton'

interface TopbarProps {
  historyCount: number
  onExport: () => void
  onReapply: (origin: string, destination: string) => void
}

function VNodeIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 52 52" fill="none">
      <rect x="1" y="1" width="50" height="50" rx="14"
        fill="var(--vx-surface)" stroke="var(--vx-cyan-border)" strokeWidth="1.5"/>
      <path d="M12 14 L22 38 L26 30 L30 38 L40 14"
        stroke="var(--vx-cyan)" strokeWidth="3.5"
        strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="26" cy="30" r="3" fill="var(--vx-cyan)"/>
      <line x1="34" y1="23" x2="44" y2="23"
        stroke="var(--vx-cyan-border)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="36" y1="27" x2="44" y2="27"
        stroke="var(--vx-cyan-dim)" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
}

export function Topbar({ historyCount, onExport, onReapply }: TopbarProps) {
  return (
    <header
      className="vx-topbar"
      style={{
        height: 52, flexShrink: 0,
        position: 'sticky', top: 0, zIndex: 200,
        background: 'var(--vx-surface)',
        borderBottom: '1px solid var(--vx-cyan-border)',
        boxShadow: '0 1px 4px rgba(120,85,35,0.08)',
        display: 'flex', alignItems: 'center', gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <VNodeIcon />
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700, fontSize: 20,
          letterSpacing: '-0.02em', lineHeight: 1,
        }}>
          <span style={{ color: 'var(--vx-cyan)' }}>V</span>
          <span style={{ color: 'var(--vx-text-primary)' }}>IAXEN</span>
        </span>
      </div>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--vx-cyan-dark)',
        background: 'var(--vx-cyan-dim)',
        border: '1px solid var(--vx-cyan-border)',
        padding: '3px 8px', borderRadius: 6,
      }}>
        Route Intelligence
      </div>

      <div style={{ flex: 1 }} />

      <div className="vx-topbar-session" style={{ flexDirection: 'column', alignItems: 'flex-end', marginRight: 8 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--vx-text-muted)',
        }}>
          Sessão
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--vx-cyan-dark)' }}>
          {historyCount} percursos
        </span>
      </div>

      <button
        onClick={onExport}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent',
          color: 'var(--vx-text-primary)',
          border: '1px solid var(--vx-cyan-border)',
          fontFamily: 'var(--font-display)',
          fontSize: 12, fontWeight: 600, letterSpacing: '0.02em',
          padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
          transition: 'background 150ms, border-color 150ms',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--vx-cyan-glow)'
          e.currentTarget.style.borderColor = 'rgba(255,122,0,0.50)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'var(--vx-cyan-border)'
        }}
      >
        <Download size={14} strokeWidth={1.5} />
        <span className="vx-topbar-export-label">Exportar CSV</span>
      </button>

      <AuthButton onReapply={onReapply} />
    </header>
  )
}
