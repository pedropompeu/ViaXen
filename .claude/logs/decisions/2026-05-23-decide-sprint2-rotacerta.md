# 📋 REGISTRO FORMAL DE DECISÃO

**Data:** 2026-05-23
**Projeto:** RotaCerta
**Contexto:** Após reunião do Setor 2 (Fábrica de Software) sobre Sprint 2, com quatro itens candidatos — labels do autocomplete, dados ANTT reais, refatoração de estado e pedágios. O setor deliberou e emitiu parecer consolidado.

**Origem:** /validate sprint1-rotacerta → /discuss_setor 2 sprint2-rotacerta → /decide sprint2-rotacerta

---

## ✅ DECISÃO FINAL

> O **Sprint 2 do RotaCerta** entrega três itens em ordem de execução:
> 1. Corrigir labels do autocomplete Nominatim (extrair `city + state` do objeto `address`)
> 2. Carregar tabela ANTT real via CSV bundled em `public/data/` com DuckDB-WASM (Opção B)
> 3. Refatorar estado do App.tsx para `RouteContext` com `useReducer`
>
> **Pedágios adiados para Sprint 3** — complexidade geométrica não justifica risco no escopo atual.

---

## 🔄 TRADE-OFFS ASSUMIDOS

| Trade-off | Impacto | Justificativa |
|-----------|---------|---------------|
| CSV bundled no repo em vez de fetch dinâmico | Atualização manual a cada trimestre | Zero CORS, zero backend, funciona offline (PWA) — custo de manutenção aceitável neste estágio |
| Schema ANTT simplificado (tipo_carga × eixos) | Não reflete NCM nem variação regional da tabela oficial | Débito de schema consciente — modelagem completa é Sprint 4+ |
| Pedágios fora do escopo | Campo "Em implementação" permanece mais um sprint | Pedágios exigem geometria computacional (interseção polyline × praças) — risco desproporcional ao valor no Sprint 2 |
| Migração incremental de estado (não big bang) | Período de transição com props e contexto coexistindo | Reduz risco de regressão nos componentes existentes |

---

## ⚠️ RISCOS ACEITOS

- **Risco de encoding:** CSV oficial ANTT frequentemente em Latin-1 (ISO-8859-1). Tratar com `encoding='latin1'` explícito no `read_csv_auto`. Se não tratado, acentos corrompidos. *[Eng. QA]*
- **Risco de performance no load:** CSV ~2MB carregado inteiro pelo DuckDB-WASM no primeiro acesso pode causar delay perceptível. Validar tempo de load antes de considerar concluído. *[Eng. DevOps]*
- **Risco de schema divergente:** A tabela ANTT real pode ter colunas diferentes do schema hardcoded atual. Análise exploratória obrigatória antes de implementar. *[Eng. IA/Prompt]*
- **Risco de regressão no Context:** Componentes que recebem props hoje precisam de migração cuidadosa. Smoke test manual de todos os fluxos ao final. *[Eng. QA]*

---

## 🗣️ DISCORDÂNCIAS REGISTRADAS

- **Eng. IA/Prompt:** sinalizou que o schema `tipo_carga × eixos × custo_fixo + variável` é simplificado demais para a tabela ANTT oficial (que usa NCM e variação regional). A posição não entrou na decisão — foi registrada como débito de schema a endereçar no Sprint 4+.

---

## 📏 MÉTRICAS DE VALIDAÇÃO

- **Métrica primária:** Labels do autocomplete exibem `"Cidade, Estado"` (ex: "São Paulo, São Paulo") em 100% das buscas — sem display_name completo visível ao usuário
- **Métrica secundária:** DuckDB carrega CSV ANTT real em < 3 segundos no primeiro acesso; todos os eixos válidos retornam valores de frete não-zero
- **Guardrail:** Nenhum fluxo existente do Sprint 1 pode regredir — rota, frete, exportação e erros inline continuam funcionando
- **Data de revisão:** Ao fim da implementação do Sprint 2 — acionar `/validate sprint2-rotacerta`

---

## 🔧 DÉBITO TÉCNICO REGISTRADO

- **Schema ANTT simplificado:** Não modela NCM nem variação regional da tabela oficial — endereçar Sprint 4+
- **Processo de atualização ANTT manual:** Atualização trimestral do CSV é manual — automatizar com script Python no CI no Sprint 3
- **Extensão spatial DuckDB-WASM:** Suporte limitado no browser impede cálculo de pedágios via geometria — avaliar alternativas no Sprint 3
- **Testes automatizados ausentes:** Validação ainda é manual — introduzir Vitest no Sprint 3

---

## ⏭️ PRÓXIMAS AÇÕES

| # | Ação | Responsável | Critério de Conclusão |
|---|------|-------------|----------------------|
| 1 | Corrigir labels do autocomplete: extrair `city + state` do objeto `address` do Nominatim | Eng. Frontend | Dropdown exibe "Cidade, Estado" — sem display_name longo visível |
| 2 | Análise exploratória do CSV ANTT real: baixar de dados.gov.br, inspecionar schema e encoding | Eng. DBA | Schema documentado, encoding confirmado, arquivo limpo gerado |
| 3 | Bundlar CSV ANTT em `public/data/antt_frete.csv` e adaptar `duckdb.ts` para carregar via fetch | Eng. DBA | `initDuckDB` carrega CSV real, smoke test de todos os eixos passa |
| 4 | Criar `RouteContext` com `useReducer` e migrar App.tsx de forma incremental | Eng. Frontend | App.tsx sem `useState` de domínio; componentes consomem contexto diretamente |

---

*Decisão registrada pelo PM — RotaCerta Sprint 2 — 2026-05-23*
*Script de vetorização: `python scripts/vectorize_memory.py .claude/logs/decisions/2026-05-23-decide-sprint2-rotacerta.md`*
