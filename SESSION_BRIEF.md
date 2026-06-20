# ViaXen — Session Brief
> Leia este arquivo no início de cada sessão. Fonte única de contexto rápido.

## Estado Atual

| Item | Valor |
|------|-------|
| Produto | SaaS B2B de rotas rodoviárias + estimativa de frete ANTT |
| Deploy | https://via-xen.vercel.app (Vercel, funcional) |
| Repo | https://github.com/pedropompeu/ViaXen |
| Stack | React 19 + TypeScript + Vite 5 + Tailwind v4 + Leaflet + OSRM + PWA |
| Backend | **Nenhum** — 100% client-side, CSV ANTT local |
| Auth | **Nenhuma** — histórico só em sessão local |
| BRAND.md | ✅ Aprovado — conceito XENITH, light theme areia quente, accent amber #FF7A00 |
| Monorepo | pnpm workspaces → `apps/web/` |

## Plano Aprovado (C-Level 2026-06-20)

```
Sprint 0  ✅ Analytics (Plausible) + Política de privacidade
Sprint 1  ⏳ Play Store via TWA — desbloqueado, aguardando APK do pwabuilder.com
Sprint 2  → Supabase: auth opcional + histórico persistido
Sprint 3  → Freemium + migrar OSRM/Nominatim (APIs públicas têm restrição comercial)
Sprint 4  ✅ Componentizar App.tsx (560 → 82 linhas) — antecipado em 2026-06-20
```

**App nativo (RN/Flutter) descartado** — TWA suficiente para caso de uso atual.

## Sprint 0 — CONCLUÍDO

- **Plausible Analytics**: script em `index.html` + `src/services/analytics.ts` com 4 eventos customizados (`calcular-rota`, `exportar-csv`, `selecionar-alternativa`, `adicionar-parada`). Conta ativada em 2026-06-20 — dashboard em plausible.io.
- **Política de Privacidade**: `/privacidade.html` (estática, tema ViaXen) + link no footer. Cobre Plausible sem cookies, dados de sessão, OSRM/Nominatim, direitos LGPD.

## Sprint 1 — EM ANDAMENTO (desbloqueado em 2026-06-20)

### O que foi feito (2026-06-20)

**Redesign XENITH completo — 5 fases:**
- **Fase 1 — Tokens:** paleta areia quente (`#EDE0C4` canvas), accent amber `#FF7A00`, Geist + Geist Mono via fontsource, textura de trama no body
- **Fase 2 — Ícones Lucide:** substituídos todos os SVGs inline; indicador lateral 4px por cor de rota em RouteAlternatives; font-mono nos valores KPI
- **Fase 3 — Mapa:** marcadores `L.divIcon` SVG por tipo (origem/parada/destino); polilínias indexadas por rota; Topbar sticky
- **Fase 4 — PWA:** favicon amber, `theme_color: #FF7A00`, `background_color: #EDE0C4`, ícones 192/512/maskable regenerados com símbolo XENITH
- **Fase 5 — WCAG AA:** `--vx-text-muted` escurecido (3.17:1 → 6.45:1); `--vx-route-primary-text: #7A3800` para texto de rota amber (6.16:1); `:focus-visible` global; ARIA em RouteAlternatives, AddressInput, Map, RouteForm

**PWA score (pwabuilder.com):**
- Service Worker melhorado: `navigateFallback: index.html` + runtimeCaching (OSM tiles CacheFirst/30d, Nominatim NetworkFirst/1d, OSRM NetworkFirst/6h)
- Screenshots adicionadas ao manifest: `desktop.png` 1280×720 (wide) + `mobile.png` 390×844 (narrow)
- Manifest: `categories`, `prefer_related_applications: false`
- 2 warnings que travavam empacotamento resolvidos

### Próximo passo (manual — pendente)

1. **Gerar APK no pwabuilder.com** → informar `https://viaxen.vercel.app` → package `com.viaxen.app`
2. **Copiar SHA-256** do certificado gerado → substituir `"PLACEHOLDER"` em `public/.well-known/assetlinks.json`
3. Commit + push do assetlinks atualizado → deploy Vercel
4. **Conta Google Play** ($25 taxa única) → submeter `.aab`

### O que fica para a próxima sessão
- Preencher `assetlinks.json` com SHA-256 real (depende do APK gerado no passo acima)
- Verificar TWA funcionando sem barra de URL no Android

## Sprint 4 — CONCLUÍDO ANTECIPADO (2026-06-20)

- **Componentização do App.tsx**: 560 → 82 linhas
- Extraídos: `hooks/useStops`, `hooks/useRouteCalculator`, `utils/format`
- Novos componentes: `Topbar`, `ErrorToast`, `RouteForm`, `RouteAlternatives`, `FreightTable`, `KpiCards`, `AppFooter`
- Deploy em produção: `via-xen.vercel.app` (commit `40268de`)

## Riscos Ativos

- OSRM e Nominatim proíbem uso comercial em escala → resolver no Sprint 3
- LGPD: persistência de histórico exige consentimento explícito → Sprint 2
- `assetlinks.json` ainda com SHA-256 placeholder → TWA não verifica até ser preenchido

## Métricas de Sucesso (revisão: 2026-08-20)

- ≥ 100 instalações Play Store em 30 dias pós-Sprint 1
- ≥ 20 DAU em 60 dias pós-Sprint 0
- ≥ 30% dos usuários fazem 3+ cálculos/semana

## Arquivos-chave

| Arquivo | O que tem |
|---------|-----------|
| `apps/web/src/App.tsx` | Orquestrador principal (82 linhas) |
| `apps/web/src/components/` | 8 componentes: Topbar, RouteForm, RouteAlternatives, FreightTable, KpiCards, Map, ErrorToast, AppFooter |
| `apps/web/src/services/routing.ts` | Integração OSRM |
| `apps/web/src/services/duckdb.ts` | Cálculo de frete (CSV ANTT) |
| `apps/web/src/services/analytics.ts` | Wrapper Plausible (4 eventos) |
| `apps/web/src/context/RouteContext.tsx` | Estado global |
| `apps/web/src/index.css` | Tokens CSS + grid + animações + WCAG |
| `apps/web/public/data/antt_frete.csv` | Tabela ANTT 5820/2019 |
| `apps/web/public/.well-known/assetlinks.json` | TWA — **SHA-256 PLACEHOLDER** (preencher após APK) |
| `apps/web/public/screenshots/` | desktop.png 1280×720 + mobile.png 390×844 |
| `apps/web/public/privacidade.html` | Política de privacidade LGPD |
| `apps/web/vite.config.ts` | Config PWA completa (manifest + Workbox runtime caching) |
| `BRAND.md` | Sistema de design XENITH aprovado — v1.0 |
| `manifesto.yaml` | Metadados do projeto |

## Decisão formal

`.claude/logs/decisions/viaxen/2026-06-20-decide-plano-evolucao-viaxen.md` (no Suporte)
