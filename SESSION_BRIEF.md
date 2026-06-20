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
| PWA | ✅ Pronto para empacotamento — score 36/45, SW ativo, manifest completo |
| Monorepo | pnpm workspaces → `apps/web/` |

## Plano Aprovado (C-Level 2026-06-20)

```
Sprint 0  ✅ Analytics (Plausible) + Política de privacidade
Sprint 1  ✅ PWA pronto — aguardando ação manual: Package For Stores no pwabuilder.com
Sprint 2  → Supabase: auth opcional + histórico persistido
Sprint 3  → Freemium + migrar OSRM/Nominatim (APIs públicas têm restrição comercial)
Sprint 4  ✅ Componentizar App.tsx (560 → 82 linhas) — antecipado em 2026-06-20
```

**App nativo (RN/Flutter) descartado** — TWA suficiente para caso de uso atual.

## Sprint 0 — CONCLUÍDO

- **Plausible Analytics**: script em `index.html` + `src/services/analytics.ts` com 4 eventos customizados.
- **Política de Privacidade**: `/privacidade.html` + link no footer. Cobre LGPD.

## Sprint 1 — CÓDIGO CONCLUÍDO (2026-06-20) — aguardando ação manual

### O que foi entregue

**Redesign XENITH completo (5 fases):**
- Paleta areia quente, accent amber #FF7A00, Geist + Geist Mono
- Lucide Icons em todos os componentes
- Marcadores Leaflet customizados (origem/parada/destino) em SVG
- WCAG AA: `--vx-text-muted` 6.45:1, `:focus-visible`, ARIA completo
- favicon.svg + ícones PWA 192/512/maskable regenerados com símbolo XENITH

**PWA — score 36/45, pronto para empacotamento:**
- Service Worker: Has Service Worker ✓ · Has Logic ✓ · Periodic Sync · Background Sync
- App Capabilities: Shortcuts ✓ · Launch Handler ✓ · File Handlers · Protocol Handlers
- Manifest: 0 erros, 0 warnings — todos campos required + recommended preenchidos
- `dir`, `display_override`, `launch_handler`, `share_target`, `shortcuts`, `categories`
- Screenshots: desktop 1280×720 + mobile 390×844
- `vercel.json`: headers corretos para `sw.js` (`no-cache`) e `workbox-*.js` (`immutable`)
- Ícones de shortcuts 96×96: seta amber (Nova Rota) + caminhão amber (Frete ANTT)
- `share_target`: endereço compartilhado de outros apps aparece como banner no RouteForm

### Próximos passos manuais (Play Store)

1. **pwabuilder.com** → `https://viaxen.vercel.app` → "Package For Stores" → Android
2. Anotar o **SHA-256 do certificado** gerado → substituir `"PLACEHOLDER"` em `public/.well-known/assetlinks.json` → commit + push
3. **Conta Google Play** ($25 taxa única) → submeter `.aab`
4. **IARC rating** — gerado dentro do próprio fluxo de submissão no Play Console (não editar o manifest manualmente)

### Campos opcionais restantes (não implementar)
- `related_applications` — adicionar após publicação na Play Store
- `iarc_rating_id` — gerado pelo Play Console durante submissão
- `scope_extensions`, `file_handlers`, `protocol_handlers` — não aplicáveis ao produto atual

## Sprint 4 — CONCLUÍDO ANTECIPADO (2026-06-20)

- **Componentização do App.tsx**: 560 → 82 linhas
- Extraídos: `hooks/useStops`, `hooks/useRouteCalculator`, `utils/format`
- Novos componentes: `Topbar`, `ErrorToast`, `RouteForm`, `RouteAlternatives`, `FreightTable`, `KpiCards`, `AppFooter`

## Riscos Ativos

- OSRM e Nominatim proíbem uso comercial em escala → resolver no Sprint 3
- LGPD: persistência de histórico exige consentimento explícito → Sprint 2
- `assetlinks.json` com SHA-256 placeholder → TWA não verifica até ser preenchido após APK

## Métricas de Sucesso (revisão: 2026-08-20)

- ≥ 100 instalações Play Store em 30 dias pós-Sprint 1
- ≥ 20 DAU em 60 dias pós-Sprint 0
- ≥ 30% dos usuários fazem 3+ cálculos/semana

## Arquivos-chave

| Arquivo | O que tem |
|---------|-----------|
| `apps/web/src/App.tsx` | Orquestrador (82 linhas) + handlers share_target e shortcuts |
| `apps/web/src/components/` | 8 componentes com Lucide Icons e tokens XENITH |
| `apps/web/src/index.css` | Tokens CSS XENITH + WCAG AA + focus-visible |
| `apps/web/src/context/RouteContext.tsx` | Estado global + sharedText para share_target |
| `apps/web/src/services/routing.ts` | Integração OSRM |
| `apps/web/src/services/duckdb.ts` | Cálculo de frete (CSV ANTT) |
| `apps/web/src/services/analytics.ts` | Wrapper Plausible (4 eventos) |
| `apps/web/public/data/antt_frete.csv` | Tabela ANTT 5820/2019 |
| `apps/web/public/.well-known/assetlinks.json` | TWA — **SHA-256 PLACEHOLDER** |
| `apps/web/public/screenshots/` | desktop.png 1280×720 + mobile.png 390×844 |
| `apps/web/public/shortcuts/` | icon-nova-rota.png + icon-frete.png (96×96) |
| `apps/web/vite.config.ts` | Config PWA completa (manifest + Workbox + shortcuts) |
| `vercel.json` | Build config + headers corretos para sw.js e workbox |
| `BRAND.md` | Sistema de design XENITH aprovado — v1.0 |
| `manifesto.yaml` | Metadados do projeto |

## Decisão formal

`.claude/logs/decisions/viaxen/2026-06-20-decide-plano-evolucao-viaxen.md` (no Suporte)
