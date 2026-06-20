import { type RouteResult } from '../services/routing'
import { fmtTime } from '../utils/format'

interface KpiCardsProps {
  route: RouteResult | null
}

export function KpiCards({ route }: KpiCardsProps) {
  const distKm = route ? (route.distance / 1000).toFixed(0) : null
  const timeH = route ? fmtTime(route.duration) : null
  const diesel = route ? ((route.distance / 1000) / 2.5).toFixed(0) : null

  return (
    <div className="vx-kpi-grid">
      <div style={{ background: 'var(--vx-card)', border: '1px solid var(--vx-cyan-border)', borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 36, height: 36, flexShrink: 0, background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--vx-cyan)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M12 3v4"/><path d="M12 17v4"/></svg>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)', marginBottom: 2 }}>Distância</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, color: distKm ? 'var(--vx-text-primary)' : 'var(--vx-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {distKm ?? '—'}{distKm && <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--vx-text-muted)', marginLeft: 4 }}>km</span>}
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--vx-card)', border: '1px solid var(--vx-cyan-border)', borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 36, height: 36, flexShrink: 0, background: 'rgba(26,107,255,0.08)', border: '1px solid rgba(26,107,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4DA6FF' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)', marginBottom: 2 }}>Tempo</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, color: timeH ? 'var(--vx-text-primary)' : 'var(--vx-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {timeH ?? '—'}
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--vx-card)', border: '1px solid var(--vx-cyan-border)', borderRadius: 10, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 36, height: 36, flexShrink: 0, background: 'rgba(255,155,33,0.08)', border: '1px solid rgba(255,155,33,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9B21' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 Z"/></svg>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--vx-text-muted)', marginBottom: 2 }}>Diesel Est.</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, color: diesel ? 'var(--vx-text-primary)' : 'var(--vx-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {diesel ?? '—'}{diesel && <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--vx-text-muted)', marginLeft: 4 }}>L</span>}
          </p>
        </div>
      </div>
    </div>
  )
}
