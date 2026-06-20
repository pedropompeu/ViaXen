import { Package, Wheat, Thermometer, FlameKindling, Box } from 'lucide-react'
import { type FreightResult } from '../context/RouteContext'

interface FreightTableProps {
  freights: FreightResult[]
}

const CARGO_ICONS: Record<string, React.ReactNode> = {
  'Geral':           <Package      size={13} strokeWidth={1.5} />,
  'Granel':          <Wheat        size={13} strokeWidth={1.5} />,
  'Frigorificado':   <Thermometer  size={13} strokeWidth={1.5} />,
  'Perigoso':        <FlameKindling size={13} strokeWidth={1.5} />,
  'Conteinerizado':  <Box          size={13} strokeWidth={1.5} />,
}

function cargoIcon(tipo: string) {
  for (const key of Object.keys(CARGO_ICONS)) {
    if (tipo.includes(key)) return CARGO_ICONS[key]
  }
  return <Package size={13} strokeWidth={1.5} />
}

export function FreightTable({ freights }: FreightTableProps) {
  if (freights.length === 0) return null

  return (
    <div style={{
      background: 'var(--vx-card)',
      border: '1px solid var(--vx-cyan-border)',
      borderRadius: 10,
      padding: 20,
      animation: 'fadeSlideIn 240ms var(--ease-out) both',
      boxShadow: '0 1px 3px rgba(120,85,35,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--vx-text-muted)',
        }}>
          Fretes ANTT
        </span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--vx-cyan-dark)',
          background: 'var(--vx-cyan-dim)',
          border: '1px solid var(--vx-cyan-border)',
          padding: '2px 7px',
          borderRadius: 5,
        }}>
          Res. 5820/2019
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {freights.map((f, idx) => (
          <div
            key={idx}
            style={{
              padding: '9px 12px',
              background: 'var(--vx-graphite)',
              border: '1px solid transparent',
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--vx-text-muted)' }}>
              {cargoIcon(f.tipo_carga)}
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--vx-text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {f.tipo_carga}
              </span>
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14, fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--vx-text-primary)',
              flexShrink: 0,
            }}>
              R$ {f.frete_minimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
