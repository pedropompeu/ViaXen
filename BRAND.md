# VIAXEN — Brand Brief
> Documento de direção criativa. Destinado ao time de design para elaboração do plano de marca completo.

---

## 1. Produto

**VIAXEN** é uma plataforma SaaS de inteligência de rotas rodoviárias e estimativa de frete ANTT.
Roda como PWA (web + Play Store via TWA). Calcula rotas, alternativas, tempo estimado e tabela de frete
(Resolução ANTT 5820/2019) direto no navegador, sem cadastro.

---

## 2. Público-alvo

### Primário — Motorista independente
- Caminhoneiros autônomos, freteiros, transportadores de carga geral
- Perfil: 30–55 anos, ensino médio, familiaridade moderada com smartphone
- Dor: calcular frete na cabeça ou em planilha, sem referência oficial
- Contexto de uso: antes de fechar um frete, na beira da estrada, em trânsito

### Secundário — Gestor de frota / empresa de logística
- Analistas de operações, coordenadores de transportes, pequenas transportadoras
- Perfil: usuário de desktop, maior familiaridade digital
- Dor: comparar rotas e custos rapidamente sem sistemas caros (TMS/ERP)
- Contexto de uso: escritório, múltiplos cálculos por dia

---

## 3. Posicionamento

> "A calculadora de frete do motorista brasileiro."

VIAXEN deve parecer uma **ferramenta séria e confiável**, não um app genérico.
O motorista independente precisa confiar que o número que aparece na tela é o número oficial — e que o app foi feito para ele, não adaptado de outro produto.

---

## 4. Direção Visual

### Tema
**Claro (light theme)** — fundo branco ou off-white. Nada de dark mode como padrão.
O motorista usa o app de dia, sob luz solar, muitas vezes com a tela no painel do caminhão.
Contraste e legibilidade são críticos.

### Textura
O design deve ter **caráter tátil** — não flat puro. Referências:
- Papel levemente texturizado (não glossy)
- Bordas com sutil profundidade (sombras suaves, não Material Design exagerado)
- Sensação de "instrumento de trabalho" — como um painel de GPS profissional ou uma prancheta de despacho

### Paleta (a definir pelo time, estas são diretrizes)
- **Fundo**: branco quente ou off-white (ex: `#F8F6F2`, `#FAFAF8`) — não branco puro
- **Destaque primário**: a ser definido — deve remeter a estrada, movimento, confiança
  - Referências de cor: laranja âmbar (combustível, sinalização), azul petróleo (profissionalismo), verde-musgo (rota, natureza)
  - O cyan `#00E5FF` atual é para dark theme — **não usar no light theme**
- **Texto**: cinza carvão escuro (`#1A1A1A` ou similar), nunca preto puro
- **Acento de alerta/ação**: vermelho suave ou âmbar para erros e CTAs secundários

### Tipografia (a validar)
- **Display/títulos**: fonte com personalidade — sem serif moderno ou grotesco condensado
- **Corpo**: alta legibilidade em tamanhos pequenos — DM Sans atual pode ser mantida ou revisada
- **Dados/números**: monospace para distância, tempo e valores de frete (JetBrains Mono atual é candidata)

### Ícones e ilustrações
- Estilo: linha grossa, geométrico, sem excesso de detalhe
- Ícone do app (obrigatório para Play Store): deve funcionar em 48×48px e em fundo claro e escuro
- Evitar: caminhão literal, rodovia genérica, globo/mapa clichê

---

## 5. Nome e Identidade Verbal

- **Nome**: VIAXEN — mantido
- **Tagline atual**: "Route Intelligence" — avaliar se comunica para o motorista independente ou só para o gestor. Sugestão de revisão: algo em português mais direto
- **Tom de voz**: direto, sem juridiquês, sem excesso de tech-speak. Fala com o motorista como um parceiro, não como um sistema

---

## 6. Entregáveis esperados do time de design

- [ ] Paleta de cores completa (primária, secundária, neutros, semânticas)
- [ ] Sistema de textura/superfície (como aplicar nas camadas do UI)
- [ ] Tipografia: escolha final + escala de tamanhos
- [ ] Logo VIAXEN em SVG (variações: horizontal, ícone, monocromática)
- [ ] Ícone do app (512×512 + maskable) para PWA/Play Store
- [ ] Moodboard de referências visuais
- [ ] Aplicação: mockup das telas principais no novo tema (pelo menos: tela inicial, resultado de rota, tabela de fretes)

---

## 7. Restrições técnicas para o time de design

- App é PWA (React + Tailwind v4) — o design system precisa ser implementável em CSS/Tailwind
- Deve funcionar bem em mobile (360px+) e desktop
- Ícones do app precisam estar nos formatos: PNG 192×192, PNG 512×512, versão maskable de cada
- O tema light será o padrão; dark mode é opcional para versões futuras

---

## 8. Referências de produto (não de marca)

Produtos que acertam em alguma dimensão relevante para o VIAXEN:
- **Waze**: acessível, linguagem do motorista, funciona sob luz solar
- **iFood para Entregadores**: simplicidade radical, foco em uma ação principal
- **Notion** (light mode): textura sutil, hierarquia limpa sem ser estéril
- **Vercel Dashboard**: precisão e confiança sem ser fria

---

*Criado em: 2026-06-20 | Status: aguardando plano de marca do time*
