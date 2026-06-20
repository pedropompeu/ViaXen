declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void
  }
}

function track(event: string, props?: Record<string, string | number | boolean>) {
  window.plausible?.(event, props ? { props } : undefined)
}

export const analytics = {
  calcularRota(params: { eixos: number; paradas: number; sucesso: boolean }) {
    track('calcular-rota', params)
  },
  exportarCSV(percursos: number) {
    track('exportar-csv', { percursos })
  },
  selecionarAlternativa(indice: number) {
    track('selecionar-alternativa', { indice })
  },
  adicionarParada() {
    track('adicionar-parada')
  },
}
