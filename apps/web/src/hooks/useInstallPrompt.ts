import { useState, useEffect } from 'react'

// Tipo não incluso no lib.dom padrão do TypeScript
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'vx-install-dismissed'

export type InstallState =
  | { kind: 'android'; prompt: BeforeInstallPromptEvent }
  | { kind: 'ios' }
  | { kind: 'hidden' }

export function useInstallPrompt(): {
  installState: InstallState
  install: () => Promise<void>
  dismiss: () => void
} {
  const [installState, setInstallState] = useState<InstallState>({ kind: 'hidden' })

  useEffect(() => {
    // Já instalado como PWA standalone — não mostrar
    if (window.matchMedia('(display-mode: standalone)').matches) return
    // Usuário já dispensou antes
    if (localStorage.getItem(DISMISSED_KEY)) return

    // iOS: Safari não dispara beforeinstallprompt — instruções manuais
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase())
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios/i.test(navigator.userAgent)
    if (isIOS && isSafari) {
      setInstallState({ kind: 'ios' })
      return
    }

    // Android Chrome: captura o evento nativo
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallState({ kind: 'android', prompt: e as BeforeInstallPromptEvent })
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Instalado com sucesso — ocultar
    const installed = () => setInstallState({ kind: 'hidden' })
    window.addEventListener('appinstalled', installed)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installed)
    }
  }, [])

  async function install() {
    if (installState.kind !== 'android') return
    await installState.prompt.prompt()
    const { outcome } = await installState.prompt.userChoice
    if (outcome === 'accepted') setInstallState({ kind: 'hidden' })
  }

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1')
    setInstallState({ kind: 'hidden' })
  }

  return { installState, install, dismiss }
}
