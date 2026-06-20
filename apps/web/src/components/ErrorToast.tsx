import { AlertCircle, X } from 'lucide-react'

interface ErrorToastProps {
  error: string
  onDismiss: () => void
}

export function ErrorToast({ error, onDismiss }: ErrorToastProps) {
  return (
    <div style={{
      margin: '16px 24px 0',
      background: 'var(--vx-card)',
      border: '1px solid rgba(185,28,28,0.20)',
      borderLeft: '3px solid var(--vx-danger)',
      borderRadius: 8,
      boxShadow: '0 4px 16px rgba(120,85,35,0.12)',
      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px',
      animation: 'fadeSlideIn 240ms var(--ease-out) both',
    }}>
      <AlertCircle
        size={16} strokeWidth={1.5}
        color="var(--vx-danger)"
        style={{ flexShrink: 0, marginTop: 1 }}
      />
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--vx-text-secondary)',
        flex: 1,
      }}>
        {error}
      </span>
      <button
        onClick={onDismiss}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--vx-text-muted)', padding: 0,
          display: 'flex', alignItems: 'center',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--vx-danger)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--vx-text-muted)')}
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  )
}
