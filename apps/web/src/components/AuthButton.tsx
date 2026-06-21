import { useState } from 'react'
import { LogIn, LogOut, History, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { HistoryPanel } from './HistoryPanel'

interface AuthButtonProps {
  onReapply: (origin: string, destination: string) => void
}

export function AuthButton({ onReapply }: AuthButtonProps) {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const [historyOpen, setHistoryOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Supabase não configurado — não renderiza nada
  if (loading) return null

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        title="Entrar para salvar seu histórico de rotas"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--vx-cyan)',
          color: '#080C10',
          fontFamily: 'var(--font-display)',
          fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
          border: 'none', borderRadius: 8,
          padding: '7px 14px', cursor: 'pointer',
          transition: 'background 150ms',
          flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--vx-cyan-dark)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--vx-cyan)')}
      >
        <LogIn size={13} strokeWidth={2} />
        <span className="vx-topbar-export-label">Entrar</span>
      </button>
    )
  }

  const initials = user.user_metadata?.name
    ? user.user_metadata.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : user.email?.[0].toUpperCase() ?? '?'

  const avatar = user.user_metadata?.avatar_url

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* Botão histórico */}
      <button
        onClick={() => setHistoryOpen(true)}
        title="Histórico de rotas"
        aria-label="Abrir histórico de rotas"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent',
          color: 'var(--vx-text-primary)',
          border: '1px solid var(--vx-cyan-border)',
          fontFamily: 'var(--font-display)',
          fontSize: 12, fontWeight: 600,
          padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
          transition: 'background 150ms, border-color 150ms',
          flexShrink: 0,
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
        <History size={14} strokeWidth={1.5} />
        <span className="vx-topbar-export-label">Histórico</span>
      </button>

      {/* Avatar / menu */}
      <button
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Menu do usuário"
        aria-expanded={menuOpen}
        style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '2px solid var(--vx-cyan-border)',
          overflow: 'hidden', cursor: 'pointer',
          background: 'var(--vx-graphite)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'border-color 150ms',
          padding: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--vx-cyan)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--vx-cyan-border)')}
      >
        {avatar
          ? <img src={avatar} alt={initials} width={32} height={32} style={{ display: 'block' }} />
          : <User size={14} strokeWidth={2} style={{ color: 'var(--vx-text-muted)' }} />
        }
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 450 }} />
          <div style={{
            position: 'absolute', top: 40, right: 0, zIndex: 500,
            background: 'var(--vx-card)',
            border: '1px solid var(--vx-subtle)',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(120,85,35,0.15)',
            minWidth: 180, overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 14px',
              borderBottom: '1px solid var(--vx-graphite)',
            }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--vx-text-muted)' }}>
                Conectado como
              </p>
              <p style={{
                margin: '2px 0 0', fontFamily: 'var(--font-body)', fontSize: 12,
                fontWeight: 600, color: 'var(--vx-text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150,
              }}>
                {user.user_metadata?.name ?? user.email}
              </p>
            </div>
            <button
              onClick={() => { signOut(); setMenuOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', border: 'none', cursor: 'pointer',
                background: 'none', textAlign: 'left',
                fontFamily: 'var(--font-body)', fontSize: 12,
                color: 'var(--vx-text-secondary)',
                transition: 'background 120ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--vx-graphite)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <LogOut size={13} strokeWidth={2} />
              Sair
            </button>
          </div>
        </>
      )}

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onReapply={onReapply}
      />
    </div>
  )
}
