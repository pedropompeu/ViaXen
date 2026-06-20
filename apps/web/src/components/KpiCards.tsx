import { Ruler, Clock, Fuel } from 'lucide-react'
import { type RouteResult } from '../services/routing'
import { fmtTime } from '../utils/format'

interface KpiCardsProps {
  route: RouteResult | null
}

interface KpiBlockProps {
  label: string
  value: string | null
  unit?: string
  icon: React.ReactNode
  iconBg: string
  iconBorder: string
  iconColor: string
}

function KpiBlock({ label, value, unit, icon, iconBg, iconBorder, iconColor }: KpiBlockProps) {
  return (
    <div style={{
      background: 'var(--vx-card)',
      border: '1px solid var(--vx-cyan-border)',
      borderRadius: 10,
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      boxShadow: '0 1px 3px rgba(120,85,35,0.06)',
    }}>
      <div style={{
        width: 36, height: 36, flexShrink: 0,
        background: iconBg,
        border: `1px solid ${iconBorder}`,
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: iconColor,
      }}>
        {icon}
      </div>
      <div>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'var(--vx-text-muted)',
          margin: '0 0 2px',
        }}>
          {label}
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 22, fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: value ? 'var(--vx-text-primary)' : 'var(--vx-text-muted)',
          fontVariantNumeric: 'tabular-nums',
          margin: 0,
        }}>
          {value ?? '—'}
          {value && unit && (
            <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--vx-text-muted)', marginLeft: 4 }}>
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}

export function KpiCards({ route }: KpiCardsProps) {
  const distKm = route ? (route.distance / 1000).toFixed(0) : null
  const timeH  = route ? fmtTime(route.duration) : null
  const diesel = route ? ((route.distance / 1000) / 2.5).toFixed(0) : null

  return (
    <div className="vx-kpi-grid">
      <KpiBlock
        label="Distância"
        value={distKm}
        unit="km"
        icon={<Ruler size={18} strokeWidth={1.5} />}
        iconBg="rgba(255,122,0,0.10)"
        iconBorder="rgba(255,122,0,0.20)"
        iconColor="var(--vx-cyan)"
      />
      <KpiBlock
        label="Tempo"
        value={timeH}
        icon={<Clock size={18} strokeWidth={1.5} />}
        iconBg="rgba(29,78,216,0.08)"
        iconBorder="rgba(29,78,216,0.20)"
        iconColor="var(--vx-info)"
      />
      <KpiBlock
        label="Diesel Est."
        value={diesel}
        unit="L"
        icon={<Fuel size={18} strokeWidth={1.5} />}
        iconBg="rgba(180,83,9,0.08)"
        iconBorder="rgba(180,83,9,0.20)"
        iconColor="var(--vx-warning)"
      />
    </div>
  )
}
