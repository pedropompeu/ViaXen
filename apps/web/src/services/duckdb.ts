// Atualizar CSV trimestralmente: dados.gov.br → "piso mínimo frete ANTT"
const ANTT_CSV_PATH = '/data/antt_frete.csv'

interface AnttRow {
  tipo_carga: string
  eixos: number
  custo_fixo: number
  custo_variavel: number
}

let cache: AnttRow[] | null = null

async function loadAntt(): Promise<AnttRow[]> {
  if (cache) return cache
  const res = await fetch(ANTT_CSV_PATH)
  if (!res.ok) throw new Error(`Falha ao carregar tabela ANTT: ${res.status}`)
  const text = await res.text()
  const [, ...rows] = text.trim().split('\n')
  cache = rows.map(line => {
    const [tipo_carga, eixos, custo_fixo, custo_variavel] = line.split(',')
    return {
      tipo_carga: tipo_carga.trim(),
      eixos: parseInt(eixos),
      custo_fixo: parseFloat(custo_fixo),
      custo_variavel: parseFloat(custo_variavel),
    }
  })
  return cache
}

// Mantido para compatibilidade com o useEffect do App.tsx — faz o preload do CSV
export async function initDuckDB() {
  await loadAntt()
}

const EIXOS_VALIDOS = new Set([2, 3, 4, 5, 6, 7, 8, 9])

export async function calculateFreight(distanciaKm: number, eixos: number) {
  if (!EIXOS_VALIDOS.has(eixos)) throw new Error(`Número de eixos inválido: ${eixos}`)
  const dist = Math.max(0, Number(distanciaKm))
  if (!isFinite(dist)) throw new Error('Distância inválida')

  const data = await loadAntt()
  return data
    .filter(r => r.eixos === eixos)
    .map(r => ({
      tipo_carga: r.tipo_carga,
      frete_minimo: r.custo_fixo + r.custo_variavel * dist,
    }))
}
