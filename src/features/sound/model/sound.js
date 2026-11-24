import { readStorage, writeStorage } from 'shared/lib'

const interactiveSelector = [
  'a',
  'button',
  'label',
  'input',
  'select',
  'textarea',
  'summary',
  '[role="button"]',
  '[role="option"]',
  '[role="menuitem"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="combobox"]',
].join(', ')

const eventElement = (node) => {
  if (node instanceof Element) {
    return node
  }

  return node?.parentElement || null
}

const interactiveElement = (node) => {
  let element = eventElement(node)
  let found = null

  while (element) {
    if (element.matches(interactiveSelector)) {
      found = element
    }

    element = element.parentElement
  }

  return found
}

const isDisabled = (element) => {
  return Boolean(element.closest('[disabled], [aria-disabled="true"]'))
}

const soundStorageKey = 'shop-sound'
const soundListeners = new Set()

const readSoundEnabled = () => {
  return readStorage(soundStorageKey) !== 'off'
}

let soundEnabled = readSoundEnabled()
let clickAudio = null

export const isSoundEnabled = () => {
  return soundEnabled
}

export const setSoundEnabled = (next) => {
  soundEnabled = Boolean(next)

  writeStorage(soundStorageKey, soundEnabled ? 'on' : 'off')

  soundListeners.forEach((listener) => listener(soundEnabled))
}

export const subscribeSound = (listener) => {
  soundListeners.add(listener)

  return () => {
    soundListeners.delete(listener)
  }
}

export const playClickSound = () => {
  if (!soundEnabled || !clickAudio) {
    return
  }

  clickAudio.currentTime = 0
  clickAudio.play().catch(() => {})
}

const installInterfaceSounds = () => {
  window.__interfaceSounds?.cleanup()

  clickAudio = new Audio('/click.mp3')
  clickAudio.preload = 'auto'
  clickAudio.volume = 0.45

  const hoverAudio = new Audio('/hover.mp3')
  hoverAudio.preload = 'auto'
  hoverAudio.volume = 0.4

  let lastClickAt = 0

  const play = (audio) => {
    if (!soundEnabled) {
      return
    }

    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  const onPointerDown = (event) => {
    if (event.button !== 0) {
      return
    }

    const control = eventElement(event.target)?.closest(interactiveSelector)

    if (!control || isDisabled(control)) {
      return
    }

    const now = performance.now()

    if (now - lastClickAt < 40) {
      return
    }

    lastClickAt = now
    play(clickAudio)
  }

  const onPointerOver = (event) => {
    if (event.pointerType === 'touch') {
      return
    }

    const next = interactiveElement(event.target)

    if (!next || isDisabled(next)) {
      return
    }

    const previous = event.relatedTarget ? interactiveElement(event.relatedTarget) : null

    if (previous === next) {
      return
    }

    play(hoverAudio)
  }

  document.addEventListener('pointerdown', onPointerDown, true)
  document.addEventListener('pointerover', onPointerOver, true)

  window.__interfaceSounds = {
    cleanup: () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('pointerover', onPointerOver, true)
    },
  }
}

installInterfaceSounds()
