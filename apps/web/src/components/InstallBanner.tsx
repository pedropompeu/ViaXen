import { Download, X, Share } from 'lucide-react'
import { type InstallState } from '../hooks/useInstallPrompt'

interface InstallBannerProps {
  installState: InstallState
  onInstall: () => void
  onDismiss: () => void
}

export function InstallBanner({ installState, onInstall, onDismiss }: InstallBannerProps) {
  if (installState.kind === 'hidden') return null

  return (
    <div
      role="banner"
      aria-label="Instalar VIAXEN como aplicativo"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500,
        background: 'var(--vx-surface)',
        borderTop: '2px solid var(--vx-cyan)',
        boxShadow: '0 -4px 24px rgba(120,85,35,0.18)',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        animation: 'fadeSlideUp 280ms var(--ease-out) both',
      }}
    >
      {/* Ícone do app */}
      <img
        src="/icon-192.png"
        alt="VIAXEN"
        width={40} height={40}
        style={{ borderRadius: 10, flexShrink: 0 }}
      />

      {/* Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontSize: 13, fontWeight: 700,
          color: 'var(--vx-text-primary)',
        }}>
          Instale o VIAXEN
        </p>
        {installState.kind === 'android' && (
          <p style={{ margin: '2px 0 0', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--vx-text-muted)' }}>
            Acesso rápido, funciona offline, sem barra de endereço.
          </p>
        )}
        {installState.kind === 'ios' && (
          <p style={{ margin: '2px 0 0', fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--vx-text-muted)' }}>
            Toque em <Share size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> e depois <strong>"Adicionar à Tela de Início"</strong>.
          </p>
        )}
      </div>

      {/* Botão instalar — só Android */}
      {installState.kind === 'android' && (
        <button
          onClick={onInstall}
          aria-label="Instalar aplicativo"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--vx-cyan)',
            color: '#080C10',
            fontFamily: 'var(--font-display)',
            fontSize: 12, fontWeight: 700,
            letterSpacing: '0.04em',
            border: 'none', borderRadius: 8,
            padding: '8px 14px', cursor: 'pointer',
            flexShrink: 0,
            transition: 'background 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--vx-cyan-dark)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--vx-cyan)')}
        >
          <Download size={13} strokeWidth={2} />
          Instalar
        </button>
      )}

      {/* Dispensar */}
      <button
        onClick={onDismiss}
        aria-label="Dispensar banner de instalação"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--vx-text-muted)', padding: 4, flexShrink: 0,
          display: 'flex', alignItems: 'center',
          transition: 'color 120ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--vx-text-primary)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--vx-text-muted)')}
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  )
}
