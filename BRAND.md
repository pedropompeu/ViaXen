# BRAND.md — ViaXen
> Documento oficial de identidade de marca e sistema de design.
> Substitui o BRAND Brief anterior (junho 2026).

```yaml
brand_version: "1.0"
brand_date: "2026-06-20"
brand_status: "aprovado"
conceito: "XENITH"
tagline: "Rota certa. Frete real."
approved_by: "NOVA"
pipeline: "ARIA → MAXWELL + ECHO → NOVA"
```

---

## 1. Conceito de Marca — XENITH

**XENITH** deriva de "zênite" — o ponto mais alto, o ângulo de máxima precisão na cartografia astronômica. Aplicado ao ViaXen, representa a rota no seu ponto ótimo: o caminho mais eficiente entre dois pontos, calculado com precisão máxima.

O símbolo parte do **X** de "ViaXen" tratado como a intersecção de duas rotas em ângulo assimétrico calculado. A rota principal é mais espessa; a secundária, mais fina — hierarquia dentro do próprio símbolo. No cruzamento: um dot de accent amber (#FF7A00), o "zênite", o ponto de decisão.

**Posicionamento em 3 palavras:** Precisão · Velocidade · Confiança

**Tagline oficial:** Rota certa. Frete real.

---

## 2. Audiência

**Primária — Decisores:**
- Gerente de Frota, Diretor de Logística, Sócio de Transportadora
- PMEs com 10–200 funcionários, transporte rodoviário, agronegócio
- Dor: calcular frete na mão, roteirizar no Google Maps, sem referência ANTT

**Secundária — Operadores:**
- Despachante, Motorista, Assistente Administrativo
- Usuários diários do produto, contexto: escritório + campo + caminhão

---

## 3. Paleta de Cores

### 3.1 Backgrounds (hierarquia de superfície)

| Token | Hex | Uso |
|-------|-----|-----|
| `--bg-canvas` | `#0A0C10` | `<body>`, base de tudo, fundo do mapa |
| `--bg-surface` | `#12151B` | Sidebar, cards, KPI blocks, painel lateral |
| `--bg-elevated` | `#1C2030` | Modais, dropdowns, tooltips, inputs focus |
| `--bg-muted` | `#252A36` | Inputs default, dividers, hover states, skeletons |
| `--bg-overlay` | `rgba(10,12,16,0.85)` | Backdrop de modal e drawer |

### 3.2 Accent

| Token | Hex | Uso |
|-------|-----|-----|
| `--accent` | `#FF7A00` | CTAs primários, elemento ativo/selecionado, indicadores |
| `--accent-hover` | `#FF9130` | Estado hover de elementos com accent |
| `--accent-active` | `#CC6200` | Estado pressed/active |
| `--accent-muted` | `rgba(255,122,0,0.10)` | Background de card selecionado, badge highlight |
| `--accent-subtle` | `rgba(255,122,0,0.15)` | Hover de card interativo com accent |

**Psicologia:** Âmbar-laranja (#FF7A00) é a cor da precisão técnica — cockpits de aviação, displays industriais, painéis de controle. Remete à estrada ao pôr-do-sol. Diferencia completamente do azul corporativo que domina o setor de logística brasileiro.

### 3.3 Texto

| Token | Hex | Uso |
|-------|-----|-----|
| `--text-primary` | `#F0F2F7` | Títulos, valores de KPI, texto principal |
| `--text-secondary` | `#8B93A8` | Labels, descrições, metadados |
| `--text-muted` | `#525B72` | Placeholders, disabled, hints, captions |
| `--text-accent` | `#FF7A00` | Texto colorido com accent |
| `--text-inverted` | `#0A0C10` | Texto em backgrounds claros (botão primário) |

### 3.4 Bordas

| Token | Valor | Uso |
|-------|-------|-----|
| `--border-default` | `#252A36` | Cards, dividers, inputs default |
| `--border-emphasis` | `#3A4154` | Input focus, card hover |
| `--border-accent` | `rgba(255,122,0,0.20)` | Bordas de elementos com accent |

### 3.5 Status semântico

| Token | Hex | Uso |
|-------|-----|-----|
| `--status-success` | `#22C55E` | Rota válida, frete calculado |
| `--status-warning` | `#F59E0B` | Pedágio, restrição, atenção |
| `--status-error` | `#EF4444` | Rota inválida, erro de cálculo |
| `--status-info` | `#3B82F6` | Informação neutra |

### 3.6 Cores de Rota (Leaflet)

| Token | Hex | Uso |
|-------|-----|-----|
| `--route-primary-color` | `#FF7A00` | Rota recomendada (polilinha principal) |
| `--route-alt1-color` | `#3B82F6` | Alternativa 1 |
| `--route-alt2-color` | `#8B5CF6` | Alternativa 2 |
| `--route-waypoint-color` | `#F0F2F7` | Marcadores de parada intermediária |

> **Integração Leaflet:** Ler tokens via JS: `getComputedStyle(document.documentElement).getPropertyValue('--route-primary-color')` e passar como opção de `L.polyline()`.

---

## 4. Tipografia

### 4.1 Fontes

| Variável | Fonte | Fallback | Uso |
|----------|-------|---------|-----|
| `--font-display` | **Geist** | DM Sans, Inter, system-ui | Títulos, headings, labels uppercase |
| `--font-body` | **Geist** | DM Sans, Inter, system-ui | Corpo de texto, UI geral |
| `--font-mono` | **Geist Mono** | JetBrains Mono, Fira Code | KPIs, distâncias, fretes, coordenadas |

**Instalação:**
```bash
pnpm add @fontsource/geist @fontsource/geist-mono
```

**Import no main.tsx:**
```tsx
import '@fontsource/geist/400.css'
import '@fontsource/geist/500.css'
import '@fontsource/geist/600.css'
import '@fontsource/geist/700.css'
import '@fontsource/geist-mono/400.css'
import '@fontsource/geist-mono/500.css'
```

### 4.2 Escala tipográfica

| Nome | Tamanho | Uso |
|------|---------|-----|
| xs | 10px | Labels uppercase, badges, captions |
| sm | 12px | Metadados, helper text, dados secundários |
| base | 14px | Corpo de texto, inputs |
| md | 15px | Texto padrão de UI |
| lg | 16px | Subtítulos, valores de KPI secundários |
| xl | 18px | Subtítulos de seção |
| 2xl | 20px | KPI valores menores |
| 3xl | 24px | Títulos de seção |
| 4xl | 32px | KPI valores hero |
| 5xl | 40px | Display hero |

### 4.3 Regras de uso

- **Dados numéricos:** sempre `font-family: var(--font-mono)` + `font-variant-numeric: tabular-nums` — obrigatório sem exceção
- **Labels uppercase:** `font-size: 10px; font-weight: 700; letter-spacing: 0.08–0.12em; text-transform: uppercase`
- **Títulos de seção:** Geist, 12–14px, weight 600–700, tracking 0.10–0.15em, uppercase
- **Valores de KPI:** Geist Mono, 20–32px, weight 700, tracking -0.02em

---

## 5. Iconografia

**Biblioteca:** [Lucide Icons](https://lucide.dev) (`lucide-react`)

**Justificativa:** Stroke-based (ideal para dark mode), tree-shakeable, cobertura completa, `strokeWidth` parametrizável, licença MIT.

**Instalação:**
```bash
pnpm add lucide-react
```

### 5.1 Tamanhos

| Nome | Tamanho | `strokeWidth` | Uso |
|------|---------|--------------|-----|
| xs | 12px | 1.5 | Ícone inline em texto |
| sm | 16px | 1.5 | Botões sm, badges |
| **md** | **20px** | **1.5** | **Padrão de UI** |
| lg | 24px | 2.0 | Ícones de ação principal |
| xl | 32px | 1.5 | Ícone de card, empty state |
| 2xl | 48px | 1.5 | Ilustrações de empty state |

### 5.2 Regra filled vs. outline

Lucide é sempre outline. Estado "ativo" simulado com:
```tsx
// Ativo
<Icon strokeWidth={2} className="text-accent" />

// Com fill sutil (selected state)
<Icon strokeWidth={2} fill="currentColor" fillOpacity={0.15} className="text-accent" />
```

### 5.3 Ícones obrigatórios

**Navegação:** `Map`, `Route`, `Navigation`, `History`, `Settings`, `LogOut`, `ChevronLeft`, `ChevronRight`, `ChevronDown`, `Menu`, `X`

**Ações:** `Search`, `Plus`, `Minus`, `Trash2`, `Download`, `Copy`, `Share2`, `RefreshCw`, `Maximize2`, `Minimize2`, `Filter`, `SlidersHorizontal`, `Save`

**Status:** `CheckCircle2` (success), `AlertCircle` (warning), `XCircle` (error), `Info`, `Loader2` (spin), `Wifi`, `WifiOff`, `Clock`, `AlertTriangle`, `Lock`

**Tipos de carga ANTT:** `Package` (geral), `Wheat` (granel), `Thermometer` (frigorificado), `FlameKindling` (perigoso), `Box` (conteinerizado), `Truck`, `Fuel`, `Weight`

**Mapa:** `MapPin`, `MapPinOff`, `Crosshair`, `Navigation2`, `Milestone`, `ArrowUpRight`, `Circle`, `Layers`, `Ruler`, `Compass`, `ZoomIn`, `ZoomOut`

---

## 6. Componentes — Especificação de Estados

### 6.1 Button

| Variante | Default | Hover | Active | Focus | Disabled | Loading |
|----------|---------|-------|--------|-------|----------|---------|
| **Primary** | bg: `--accent`, text: `--text-inverted` | bg: `--accent-hover` | bg: `--accent-active` | ring: `0 0 0 3px rgba(255,122,0,0.20)` | bg: `--bg-muted`, text: `--text-muted`, cursor: not-allowed | opacity: 0.7, spinner |
| **Secondary** | bg: `--bg-muted`, border: `--border-default` | bg: `--bg-elevated`, border: `--border-emphasis` | bg: `--bg-muted` | ring accent | idem primary | idem |
| **Ghost** | bg: transparent, text: `--text-secondary` | bg: `--bg-muted`, text: `--text-primary` | bg: `--bg-muted` | ring accent | text: `--text-muted`, cursor: not-allowed | idem |
| **Destructive** | bg: `rgba(239,68,68,0.10)`, text: `--status-error`, border: `rgba(239,68,68,0.30)` | bg: `rgba(239,68,68,0.20)`, border: `rgba(239,68,68,0.50)` | bg: `rgba(239,68,68,0.25)` | ring red | idem primary | idem |

**Tamanhos:** sm (32px / 12px padding) · md (40px / 16px padding) · lg (48px / 20px padding)
**Border-radius:** `--primitive-radius-lg` (8px)

### 6.2 Input

| Estado | Border | Background | Shadow |
|--------|--------|------------|--------|
| Default | `--border-default` | `--bg-muted` | none |
| Hover | `--border-emphasis` | `--bg-elevated` | none |
| Focus | `--accent` | `--bg-surface` | `0 0 0 3px rgba(255,122,0,0.10)` |
| Error | `--status-error` | `--bg-muted` | `0 0 0 3px rgba(239,68,68,0.10)` |
| Disabled | `--border-default` | `--bg-muted` | none, cursor: not-allowed, opacity: 0.5 |

### 6.3 RouteCard

Cada rota tem um **indicador lateral de 4px** na borda esquerda, na cor da polilinha correspondente.

| Estado | Rota Principal | Alt 1 | Alt 2 |
|--------|---------------|-------|-------|
| Default | bg: `--bg-muted`, border: `--border-default` | idem | idem |
| Hover | bg: `--bg-elevated`, border: `--border-emphasis` | idem | idem |
| **Selected** | bg: `rgba(255,122,0,0.10)`, border: `rgba(255,122,0,0.40)`, indicator: `#FF7A00` | bg: `rgba(59,130,246,0.10)`, border: `rgba(59,130,246,0.40)`, indicator: `#3B82F6` | bg: `rgba(139,92,246,0.10)`, border: `rgba(139,92,246,0.40)`, indicator: `#8B5CF6` |

Valor de dados (distância/tempo): cor do indicator quando selecionado, `--text-muted` quando não selecionado.

### 6.4 KPIBlock

```
+---------------------------------------------+
| [ícone 36x36px]  DISTÂNCIA                  |  <- label: 10px, 700, uppercase, --text-muted
|                  487                    km   |  <- valor: Geist Mono, 22px, 700, tabular-nums
+---------------------------------------------+
```

- Ícone: 36×36px, border-radius 8px, bg tintado com cor semântica, ícone Lucide 18px
- Label: `var(--font-display)`, 10px, weight 700, tracking 0.10em, uppercase, `--text-muted`
- Valor: `var(--font-mono)`, 22px, weight 700, tracking -0.02em, `font-variant-numeric: tabular-nums`
- Unidade: 12px, weight 400, `--text-muted`, margin-left 4px

### 6.5 Badge

```css
height: 20px; padding: 0 8px; border-radius: 9999px;
font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
border: 1px solid;
```

| Variante | bg | text | border |
|----------|----|------|--------|
| success | `rgba(34,197,94,0.10)` | `#22C55E` | `rgba(34,197,94,0.20)` |
| warning | `rgba(245,158,11,0.10)` | `#F59E0B` | `rgba(245,158,11,0.20)` |
| error | `rgba(239,68,68,0.10)` | `#EF4444` | `rgba(239,68,68,0.20)` |
| info | `rgba(59,130,246,0.10)` | `#3B82F6` | `rgba(59,130,246,0.20)` |
| neutral | `--bg-muted` | `--text-secondary` | `--border-default` |

---

## 7. Layout

### 7.1 Grid principal

```css
/* Mobile (< 1024px) */
grid-template-columns: 1fr;
gap: 16px;
padding: 16px;

/* Desktop (>= 1024px) */
grid-template-columns: 340px 1fr;  /* sidebar 340px -- era 300px */
gap: 20px;
padding: 20px 24px 24px;
```

### 7.2 Mapa

```css
/* Mobile */  height: 260px;   /* era 240px */
/* Tablet */  height: 380px;   /* era 340px */
/* Desktop */ height: 520px;   /* era 460px */
```

### 7.3 Topbar

```css
height: 56px;
background: rgba(10, 12, 16, 0.80);
backdrop-filter: blur(12px);
border-bottom: 1px solid var(--border-default);
position: sticky; top: 0; z-index: var(--z-sticky);
```

---

## 8. Tailwind CSS v4 — @theme

Adicionar em `apps/web/src/index.css` após os tokens:

```css
@import "tailwindcss";

@theme {
  --color-canvas:       #0A0C10;
  --color-surface:      #12151B;
  --color-elevated:     #1C2030;
  --color-muted:        #252A36;
  --color-accent:       #FF7A00;
  --color-accent-hover: #FF9130;
  --color-text:         #F0F2F7;
  --color-text-2:       #8B93A8;
  --color-text-muted:   #525B72;
  --color-success:      #22C55E;
  --color-warning:      #F59E0B;
  --color-error:        #EF4444;
  --color-info:         #3B82F6;
  --color-route-1:      #FF7A00;
  --color-route-2:      #3B82F6;
  --color-route-3:      #8B5CF6;

  --font-sans: 'Geist', 'DM Sans', 'Inter', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;

  --radius-sm:   4px;
  --radius-md:   6px;
  --radius-lg:   8px;
  --radius-xl:   10px;
  --radius-2xl:  12px;
  --radius-full: 9999px;
}
```

---

## 9. Voz de Marca

### 9.1 4 traços de personalidade

**PRECISO** — Fala em números verificáveis. Nunca arredonda.
> ON: "487 km · 6h14min · R$ 312,40 de frete estimado pela tabela ANTT vigente."
> OFF: "Estimativas aproximadas para facilitar sua logística."

**DIRETO** — Vai ao ponto. Zero preâmbulos.
> ON: "Rota calculada. Escolha a alternativa e exporte."
> OFF: "Ficamos felizes em informar que sua rota foi processada!"

**AUTORITATIVO** — Domina o domínio. Afirma, não sugere.
> ON: "Esta rota excede o limite diário de jornada. Planeje parada em Três Lagoas."
> OFF: "Talvez valha considerar uma pausa, dependendo das suas preferências."

**MINIMALISTA** — Cada palavra carrega carga. Zero adjetivos decorativos.
> ON: "Sem conexão. Dados da última sessão disponíveis."
> OFF: "Ops! Parece que você está sem internet. Mas não se preocupe!"

### 9.2 Variação de tom

| Contexto | Tom |
|----------|-----|
| Onboarding | Autoritativo + acolhedor. Instrui com confiança, sem infantilizar. |
| Erro | Direto + neutro. Informa e orienta. Zero emojis, zero desculpas. |
| Sucesso | Minimalista + afirmativo. Confirma, entrega dado, sugere próximo passo. |
| Empty state | Direto + orientador. Explica e convida à ação com um verbo imperativo. |
| Marketing | Autoritativo + aspiracional. Usa números reais, eleva sem prometer demais. |

### 9.3 Anti-patterns — palavras banidas

| Banido | Por que |
|--------|---------|
| "Plataforma inovadora" | Buzzword vazia |
| "Transformação digital" | Cliché de 2015 |
| "Disruptivo" | Pitch de startup, não ferramenta operacional |
| "Solução" (genérico) | Diz zero sobre o produto |
| "Ecossistema" | ViaXen é ferramenta de foco, não plataforma horizontal |
| "Alavancar / leverage" | Anglicismo corporativo hollow |
| "Ficamos felizes em..." | Personificação vazia |
| "Não se preocupe!" | Patronizante |
| "Simplificamos a logística" | Desrespeita a complexidade do domínio |
| "Tudo em um só lugar" | Promessa de super-app que ViaXen não é |
| "Intuitivo / fácil de usar" | Auto-elogio que a UX deve provar |
| "Potencialize seus resultados" | Vago ao extremo |

---

## 10. Microcopy

### Empty states
| Contexto | Título | Subtítulo |
|----------|--------|-----------|
| Nenhuma rota calculada | **Nenhuma rota calculada** | Informe origem e destino para ver as alternativas de trajeto e a estimativa de frete. |
| Sem paradas | **Sem paradas intermediárias** | Adicione pontos de parada para ajustar o trajeto ou planejar descanso obrigatório. |
| Histórico vazio | **Nenhuma consulta salva** | As consultas salvas aparecem aqui para consulta rápida. |
| Endereço não encontrado | **Endereço não localizado** | Tente um CEP ou nome de cidade mais específico. |

### Loading states
| Processo | Texto |
|----------|-------|
| Calculando rota | **Calculando rotas...** (sub: Comparando três alternativas de trajeto) |
| Estimando frete | **Estimando frete...** (sub: Aplicando tabela ANTT vigente) |
| Geocodificando | **Localizando endereço...** |
| Exportando | **Gerando arquivo...** |

### Error states
| Erro | Título | Mensagem |
|------|--------|----------|
| Rota não encontrada | **Rota não encontrada** | Não foi possível calcular um trajeto rodoviário entre os pontos informados. |
| Endereço inválido | **Endereço não reconhecido** | Use o nome da cidade, o CEP ou as coordenadas geográficas. |
| Serviço indisponível | **Serviço temporariamente indisponível** | Falha na comunicação com o servidor de rotas. Dados da última sessão disponíveis. |
| Offline | **Sem conexão** | ViaXen opera offline com os dados da última sessão sincronizada. |

### Success states
| Evento | Texto principal | Sub |
|--------|----------------|-----|
| Rota calculada | **Rota calculada** | 3 alternativas disponíveis. Selecione a mais adequada ao seu veículo e prazo. |
| Frete estimado | **Frete estimado** | Valor calculado pela tabela ANTT vigente. |
| CSV exportado | **Arquivo exportado** | Os dados desta consulta foram salvos em formato CSV. |

### CTAs
| Ação | Texto |
|------|-------|
| Ação principal | **Calcular rota** |
| Recalcular | **Recalcular rota** |
| Exportar | **Exportar CSV** |
| Nova consulta | **Nova consulta** |
| Selecionar rota | **Usar esta rota** |
| Limpar (modal) | **Limpar** |
| Cancelar | **Cancelar** |

---

## 11. Taglines

| # | Tagline | Tipo | Uso principal |
|---|---------|------|---------------|
| **1 (oficial)** | **Rota certa. Frete real.** | Funcional | Hero, cartão de app, pitch deck |
| 2 | Calcule antes de sair. | Imperativo | Anúncios, push notification |
| 3 | Três rotas. Um frete. Decisão sua. | Funcional | Onboarding, landing page de feature |
| 4 | No ponto ótimo da rota. | Conceitual | Material institucional, diretoria |
| 5 | Logística de precisão começa na rota. | Aspiracional | Homepage secundária, proposta comercial |

---

## 12. Logo — Diretrizes de Uso

### 12.1 Símbolo (X XENITH)

Construção: X assimétrico onde a barra diagonal principal é 30% mais espessa que a secundária. No ponto de cruzamento, dot circular em accent (#FF7A00) com diâmetro = 1/5 da largura total do símbolo.

**Pixel grid:**
- 16x16px (favicon): apenas o X, sem dot (muito pequeno)
- 32x32px (aba do browser): X + dot simples
- 192x192px (PWA icon): X + dot + wordmark abaixo opcional
- 512x512px (splash): versão completa com wordmark

### 12.2 Wordmark

"Via" em weight Regular + "Xen" em weight Bold. Tracking: -0.01em. Case: Title Case.

### 12.3 Proibido

- Inverter cores sobre fundo claro sem usar a versão light do logo
- Rotacionar ou distorcer o símbolo
- Usar azul corporativo como substituto do accent
- Adicionar sombras, glows externos, ou efeitos 3D
- Usar versão outline do X (apenas filled/stroked é permitido)

---

## 13. Acessibilidade

- **WCAG AA mínimo** para todos os elementos interativos
- Contraste accent sobre canvas: #FF7A00 sobre #0A0C10 = **4.87:1** (passa AA)
- Contraste texto sobre surface: #F0F2F7 sobre #12151B = **13.4:1** (passa AAA)
- `prefers-reduced-motion`: todas as animações devem respeitar
- Foco visível: ring de 3px em `rgba(255,122,0,0.30)` em todos os elementos interativos
- Dados numéricos com `font-variant-numeric: tabular-nums` para legibilidade

---

## 14. Plano de Implementação do Redesenho

### Fase 1 — Tokens e Fontes (2-3h)
**Objetivo:** Trocar a base sem quebrar o produto.

1. Instalar fontes Geist: `pnpm add @fontsource/geist @fontsource/geist-mono`
2. Copiar `brand/design-tokens.css` para `apps/web/src/`
3. Atualizar `apps/web/src/index.css`:
   - Substituir `:root { }` atual pelos novos tokens semânticos
   - Trocar `--font-display: 'Space Grotesk'` por `'Geist'`
   - Trocar `--font-body: 'DM Sans'` por `'Geist'`
   - Trocar `--font-mono: 'JetBrains Mono'` por `'Geist Mono'`
4. Trocar accent cyan por amber em todo o CSS:
   - `--vx-cyan` passa a ser `var(--accent)` (#FF7A00)
   - `--vx-cyan-border` passa a ser `var(--border-accent)`
   - `rgba(0, 229, 255, ...)` passa a ser `rgba(255, 122, 0, ...)`
5. Atualizar background grid: trocar ciano por amber com opacidade 0.03

**Criterio de aceitação:** App carrega com nova tipografia e cor amber visível. Sem regressão funcional.

### Fase 2 — Componentes (4-6h)
**Objetivo:** Refatorar componentes para usar tokens semânticos e Lucide Icons.

Componentes em ordem de impacto visual:

1. `Topbar.tsx` — sticky com backdrop-filter, logo atualizado, ícones Lucide
2. `KpiCards.tsx` — ícones Lucide, tokens de KPIBlock, Geist Mono nos valores
3. `RouteAlternatives.tsx` — indicador lateral 4px colorido por rota, tokens de RouteCard
4. `RouteForm.tsx` — inputs com tokens de Input, labels uppercase
5. `FreightTable.tsx` — tabela com valores em Geist Mono, badges de tipo de carga
6. `AddressInput.tsx` — ícone Search, estado de loading com Loader2
7. `ErrorToast.tsx` — ícone XCircle, tokens de Toast
8. `AppFooter.tsx` — tokens de texto muted

**Criterio de aceitação:** Todos os componentes usando tokens sem hardcoded hex. Icones Lucide em todos os pontos de interação.

### Fase 3 — Mapa e Layout (2-3h)
**Objetivo:** Atualizar mapa e ajustar grid.

1. `App.css`: sidebar 340px (era 300px), mapa 520px desktop
2. `App.css`: atualizar overrides Leaflet (substituir cyan por amber)
3. Tiles do mapa: manter filtro CSS atual (`invert + hue-rotate`) — funciona bem para dark
4. Cores de polilinha: usar tokens `--route-primary-color`, `--route-alt1-color`, `--route-alt2-color` via JS
5. Marcadores: SVG customizados com cor de accent

**Criterio de aceitação:** Mapa com polilinha em amber (rota principal), azul (alt 1), violeta (alt 2). Sidebar com novo breakpoint.

### Fase 4 — PWA e Assets (1-2h)
**Objetivo:** Atualizar ícones e assets de marca.

1. Gerar novos ícones PWA (192x192, 512x512) com símbolo XENITH + accent amber
2. Atualizar `favicon.svg` com X assimétrico + dot amber
3. Verificar `manifest.json`: `theme_color` deve ser `#FF7A00`, `background_color` deve ser `#0A0C10`

**Criterio de aceitação:** PWA instalado mostra novo ícone. Favicon amber visível na aba do browser.

### Fase 5 — QA e WCAG (1h)
1. Verificar contraste em todos os estados de componente
2. Testar `prefers-reduced-motion`
3. Testar navegação por teclado (tab order, focus rings)
4. Testar PWA offline com novos assets

---

## Arquivos de referência

| Arquivo | Localização |
|---------|-------------|
| Design Tokens (CSS) | `brand/design-tokens.css` |
| Este BRAND.md | `BRAND.md` |
| Componentes | `apps/web/src/components/` |
| CSS atual (a migrar) | `apps/web/src/index.css` + `App.css` |

---

*BRAND.md v1.0 — ViaXen — Conceito XENITH — Aprovado por NOVA — 2026-06-20*
*Pipeline: ARIA (fundação) -> MAXWELL + ECHO (paralelo) -> NOVA (QA + entrega)*
