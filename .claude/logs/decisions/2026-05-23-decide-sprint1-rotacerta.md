# 📋 REGISTRO FORMAL DE DECISÃO

**Data:** 2026-05-23  
**Projeto:** RotaCerta  
**Contexto:** Após reunião executiva C-Level revisando o estado do MVP (entregue na sessão anterior), o time identificou quatro gaps críticos que impedem a demonstração do produto para usuários reais. Este documento formaliza a decisão de executar o Sprint 1 — conjunto mínimo de correções e features para tornar o produto demonstrável.

**Origem:** /discuss RotaCerta → /decide Sprint1

---

## ✅ DECISÃO FINAL

> Executar o **Sprint 1 do RotaCerta** imediatamente: corrigir o SQL injection em `duckdb.ts`, implementar input dinâmico de endereços com Nominatim + debounce, melhorar tratamento de erro do OSRM e adicionar loading visual no mapa. Estas quatro ações desbloqueiam o produto para demonstração real com transportadores.

---

## 🔄 TRADE-OFFS ASSUMIDOS

| Trade-off | Impacto | Justificativa |
|-----------|---------|---------------|
| Nominatim público (sem instância própria) | Rate limit 1 req/s — inviável para múltiplos usuários simultâneos | Orçamento zero; validar mercado antes de investir em infra |
| Dados ANTT simulados ficam para Sprint 2 | Valores de frete não refletem tabela oficial | Sprint 1 foca em desbloqueio de UX; credibilidade vem no Sprint 2 |
| Autocomplete sem biblioteca externa | Mais código a manter, mas zero dependência adicional | Controle total, performance previsível, sem lock-in |
| Rotas apenas ponto A→B | Não cobre caso de multiparada | Multiparada é Sprint 3; OSRM já suporta, é só UI |

---

## ⚠️ RISCOS ACEITOS

- **Risco técnico — OSRM público sem SLA:** `router.project-osrm.org` é servidor de demonstração comunitário. Se cair, o produto fica indisponível. Mitigação Sprint 1: mensagem de erro informativa. Mitigação definitiva: Sprint 3 (deploy próprio ou alternative). *[Arquiteto Chefe]*
- **Risco de segurança — SQL interpolado (a corrigir):** Padrão atual em `duckdb.ts:52-57` usa interpolação direta de `${eixos}` e `${distanciaKm}`. Risco atual baixo (input é `Number()` de select), mas padrão vai se propagar. **Deve ser corrigido na Tarefa #1.** *[Segurança — CONDICIONAL]*
- **Risco de produto — endereços geocodificados podem falhar:** Nominatim tem cobertura excelente de grandes cidades brasileiras, mas endereços rurais/industriais podem não ser encontrados. Usuário precisa de feedback claro quando geocodificação falha. *[Cliente]*

---

## 🗣️ DISCORDÂNCIAS REGISTRADAS

- Nenhuma discordância formal registrada nesta decisão. Consenso atingido na Rodada 2.

> *Ausência de discordância registrada indica consenso genuíno, não falta de pensamento crítico.*

---

## 📏 MÉTRICAS DE VALIDAÇÃO

- **Métrica primária:** Usuário consegue digitar origem e destino arbitrários e ver rota + frete calculados em < 5 segundos — threshold: 100% de sucesso nos 10 primeiros testes manuais
- **Métrica secundária:** Zero erros de `alert()` nativo exibidos durante sessão de teste
- **Guardrail:** Cálculo de frete (DuckDB) não pode regredir — todos os tipos de carga e eixos devem continuar retornando valores
- **Data de revisão:** Ao final da implementação do Sprint 1 — acionar `/validate sprint1-rotacerta`

---

## 🔧 DÉBITO TÉCNICO REGISTRADO

- **Estado global em `useState` no `App.tsx`:** À medida que inputs dinâmicos são adicionados, o estado vai crescer acoplado. Refatorar para contexto React é débito consciente assumido — endereçar no Sprint 2.
- **Tabela ANTT hardcoded em JS:** Dados simulados, não refletem tabela oficial. Carregar CSV real do dados.gov.br via DuckDB-WASM é Sprint 2.
- **Cálculo de pedágios ausente:** Campo no UI exibe "Em implementação". Solução real requer tabela de pedágios ANTT — Sprint 2.

---

## ⏭️ PRÓXIMAS AÇÕES

| # | Ação | Responsável | Prazo |
|---|------|-------------|-------|
| 1 | Corrigir SQL injection em `duckdb.ts` — usar validação de enum explícita em vez de interpolação direta | Eng. DBA | Sprint 1 |
| 2 | Implementar componente de input de endereço com autocomplete Nominatim + debounce 500ms | Eng. Frontend | Sprint 1 |
| 3 | Substituir `alert()` por feedback visual inline para erros do OSRM | Eng. Frontend | Sprint 1 |
| 4 | Adicionar estado de loading visual no mapa durante cálculo de rota | Eng. Frontend | Sprint 1 |

---

## 📋 TAREFAS CRIADAS

> A serem registradas via TaskCreate imediatamente após este documento.

---

*Decisão registrada pelo PM — RotaCerta Sprint 1 — 2026-05-23*  
*Script de vetorização: `python scripts/vectorize_memory.py .claude/logs/decisions/2026-05-23-decide-sprint1-rotacerta.md`*
