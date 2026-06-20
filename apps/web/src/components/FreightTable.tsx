import { type FreightResult } from '../context/RouteContext'

interface FreightTableProps {
  freights: FreightResult[]
}

export function FreightTable({ freights }: FreightTableProps) {
  if (freights.length === 0) return null

  return (
    <div style={{ background: 'var(--vx-card)', border: '1px solid var(--vx-cyan-border)', borderRadius: 10, padding: 20, animation: 'fadeSlideIn 240ms var(--ease-out) both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)' }}>Fretes ANTT</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--vx-cyan)', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', padding: '2px 7px', borderRadius: 5 }}>Res. 5820/2019</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
        {freights.map((f, idx) => (
          <div key={idx} style={{ padding: '10px 12px', background: 'var(--vx-graphite)', border: '1px solid rgba(0,229,255,0.08)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--vx-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{f.tipo_carga}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500, color: 'var(--vx-text-primary)', flexShrink: 0 }}>R$ {f.frete_minimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
