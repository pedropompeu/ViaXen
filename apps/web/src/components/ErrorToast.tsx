interface ErrorToastProps {
  error: string
  onDismiss: () => void
}

export function ErrorToast({ error, onDismiss }: ErrorToastProps) {
  return (
    <div style={{
      margin: '16px 24px 0',
      background: '#1F2B3A', border: '1px solid rgba(0,229,255,0.18)',
      borderLeft: '3px solid #FF4D4D', borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px',
      animation: 'fadeSlideIn 240ms var(--ease-out) both',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4D4D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--vx-text-secondary)', flex: 1 }}>{error}</span>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vx-text-muted)', padding: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  )
}
