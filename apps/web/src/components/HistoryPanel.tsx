import { useEffect, useState } from 'react'
import { X, Clock, Trash2, CornerDownRight } from 'lucide-react'
import { loadHistory, deleteHistoryEntry, type HistoryEntry } from '../services/history'

interface HistoryPanelProps {
  open: boolean
  onClose: () => void
  onReapply: (origin: string, destination: string) => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

function formatDistance(km: number | null) {
  if (!km) return '—'
  return km >= 1 ? `${km.toFixed(0)} km` : `${(km * 1000).toFixed(0)} m`
}

export function HistoryPanel({ open, onClose, onReapply }: HistoryPanelProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    loadHistory().then(data => {
      setEntries(data)
      setLoading(false)
    })
  }, [open])

  async function handleDelete(id: string) {
    await deleteHistoryEntry(id)
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(44,26,6,0.35)',
          animation: 'fadeIn 180ms var(--ease-out) both',
        }}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Histórico de rotas"
        aria-modal="true"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(380px, 100vw)', zIndex: 400,
          background: 'var(--vx-surface)',
          borderLeft: '1px solid var(--vx-cyan-border)',
          boxShadow: '-8px 0 32px rgba(120,85,35,0.18)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInRight 240ms var(--ease-smooth) both',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '16px 20px',
          borderBottom: '1px solid var(--vx-cyan-border)',
          flexShrink: 0,
        }}>
          <Clock size={16} strokeWidth={2} style={{ color: 'var(--vx-cyan)' }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
            color: 'var(--vx-text-primary)', flex: 1,
          }}>
            Histórico de Rotas
          </span>
          <button
            onClick={onClose}
            aria-label="Fechar histórico"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--vx-text-muted)', display: 'flex', padding: 4,
              transition: 'color 120ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--vx-text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--vx-text-muted)')}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Lista */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {loading && (
            <p style={{
              textAlign: 'center', padding: 32,
              fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'var(--vx-text-muted)',
            }}>
              Carregando...
            </p>
          )}

          {!loading && entries.length === 0 && (
            <p style={{
              textAlign: 'center', padding: 32,
              fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'var(--vx-text-muted)', lineHeight: 1.6,
            }}>
              Nenhuma rota salva ainda.<br />
              Calcule uma rota para começar.
            </p>
          )}

          {entries.map(entry => (
            <div
              key={entry.id}
              style={{
                padding: '12px 20px',
                borderBottom: '1px solid var(--vx-graphite)',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: 0,
                    fontFamily: 'var(--font-body)', fontSize: 12,
                    fontWeight: 600, color: 'var(--vx-text-primary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {entry.origin}
                  </p>
                  <p style={{
                    margin: '2px 0 0',
                    fontFamily: 'var(--font-body)', fontSize: 12,
                    color: 'var(--vx-text-secondary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    → {entry.destination}
                  </p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--vx-cyan-dark)' }}>
                      {formatDistance(entry.distance_km)}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--vx-text-muted)' }}>
                      {formatDate(entry.calculated_at)}
                    </span>
                  </div>
                </div>

                {/* Ações */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <button
                    onClick={() => { onReapply(entry.origin, entry.destination); onClose() }}
                    title="Usar esta rota"
                    aria-label={`Reaplicar rota ${entry.origin} → ${entry.destination}`}
                    style={{
                      background: 'var(--vx-cyan-glow)', border: '1px solid var(--vx-cyan-border)',
                      borderRadius: 6, cursor: 'pointer', padding: 6,
                      color: 'var(--vx-cyan-dark)', display: 'flex',
                      transition: 'background 120ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--vx-cyan-dim)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--vx-cyan-glow)')}
                  >
                    <CornerDownRight size={13} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    title="Remover"
                    aria-label={`Remover rota ${entry.origin} → ${entry.destination} do histórico`}
                    style={{
                      background: 'none', border: '1px solid transparent',
                      borderRadius: 6, cursor: 'pointer', padding: 6,
                      color: 'var(--vx-text-muted)', display: 'flex',
                      transition: 'color 120ms, background 120ms',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = 'var(--vx-danger)'
                      e.currentTarget.style.background = 'rgba(185,28,28,0.08)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--vx-text-muted)'
                      e.currentTarget.style.background = 'none'
                    }}
                  >
                    <Trash2 size={13} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}
