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
| BRAND.md | ✅ Criado — aguardando time de design entregar assets |
| Monorepo | pnpm workspaces → `apps/web/` |

## Plano Aprovado (C-Level 2026-06-20)

```
Sprint 0  ✅ Analytics (Plausible) + Política de privacidade
Sprint 1  ⏳ Play Store via TWA — BLOQUEADO aguardando rebrand
Sprint 2  → Supabase: auth opcional + histórico persistido
Sprint 3  → Freemium + migrar OSRM/Nominatim (APIs públicas têm restrição comercial)
Sprint 4  ✅ Componentizar App.tsx (560 → 82 linhas) — antecipado em 2026-06-20
```

**App nativo (RN/Flutter) descartado** — TWA suficiente para caso de uso atual.

## Sprint 0 — CONCLUÍDO

- **Plausible Analytics**: script em `index.html` + `src/services/analytics.ts` com 4 eventos customizados (`calcular-rota`, `exportar-csv`, `selecionar-alternativa`, `adicionar-parada`). Conta ativada em 2026-06-20 — dashboard em plausible.io.
- **Política de Privacidade**: `/privacidade.html` (estática, tema ViaXen) + link no footer. Cobre Plausible sem cookies, dados de sessão, OSRM/Nominatim, direitos LGPD.

## Sprint 1 — EM ANDAMENTO (bloqueado)

### O que foi feito
- Manifest PWA atualizado: `id`, `start_url`, `scope`, `orientation`, `lang: pt-BR`
- `public/.well-known/assetlinks.json` criado com placeholder SHA-256
- `vercel.json` com header `Content-Type: application/json` para assetlinks

### Bloqueio: Rebrand visual
Decisão: **light theme** (fundo branco/off-white) + sistema de texturas táteis, público primário é motorista/caminhoneiro independente. BRAND.md entregue ao time de design com todos os entregáveis esperados.

### Próximos passos quando o rebrand chegar
1. Aplicar paleta + tipografia no CSS/Tailwind
2. Substituir ícones do app (PNG 192, 512, maskable)
3. Gerar APK no **pwabuilder.com** → package `com.viaxen.app`
4. Preencher SHA-256 real no `assetlinks.json` e fazer deploy
5. Conta Google Play ($25 taxa única) → submeter `.aab`

## Sprint 4 — CONCLUÍDO ANTECIPADO (2026-06-20)

- **Componentização do App.tsx**: 560 → 82 linhas
- Extraídos: `hooks/useStops`, `hooks/useRouteCalculator`, `utils/format`
- Novos componentes: `Topbar`, `ErrorToast`, `RouteForm`, `RouteAlternatives`, `FreightTable`, `KpiCards`, `AppFooter`
- Deploy em produção: `via-xen.vercel.app` (commit `40268de`)

## Riscos Ativos

- OSRM e Nominatim proíbem uso comercial em escala → resolver no Sprint 3
- Sem dados de uso real → Sprint 0 resolveu com Plausible (aguarda ativação da conta)
- LGPD: persistência de histórico exige consentimento explícito → Sprint 2
- Rebrand bloqueia lançamento na Play Store → aguardando time de design

## Métricas de Sucesso (revisão: 2026-08-20)

- ≥ 100 instalações Play Store em 30 dias pós-Sprint 1
- ≥ 20 DAU em 60 dias pós-Sprint 0
- ≥ 30% dos usuários fazem 3+ cálculos/semana

## Arquivos-chave

| Arquivo | O que tem |
|---------|-----------|
| `apps/web/src/App.tsx` | Frontend principal (monolítico, 544 linhas) |
| `apps/web/src/services/routing.ts` | Integração OSRM |
| `apps/web/src/services/duckdb.ts` | Cálculo de frete (CSV ANTT) |
| `apps/web/src/services/analytics.ts` | Wrapper Plausible (4 eventos) |
| `apps/web/src/context/RouteContext.tsx` | Estado global |
| `apps/web/public/data/antt_frete.csv` | Tabela ANTT 5820/2019 |
| `apps/web/public/.well-known/assetlinks.json` | TWA — SHA-256 placeholder |
| `apps/web/public/privacidade.html` | Política de privacidade LGPD |
| `apps/web/vite.config.ts` | Config PWA (manifest, Workbox) |
| `BRAND.md` | Brief de direção criativa para o time de design |
| `manifesto.yaml` | Metadados do projeto |

## Decisão formal

`.claude/logs/decisions/viaxen/2026-06-20-decide-plano-evolucao-viaxen.md` (no Suporte)
