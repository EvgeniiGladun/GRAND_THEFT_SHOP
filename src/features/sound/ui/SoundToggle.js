import { ActionIcon } from '@mantine/core'
import React from 'react'
import { playClickSound } from '../model/sound'
import { useSoundEnabled } from '../model/useSoundEnabled'

const SpeakerOn = () => {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M4 9v6h3.5L13 19.5v-15L7.5 9H4z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M16 9.2a3.2 3.2 0 0 1 0 5.6M18.4 7a6.2 6.2 0 0 1 0 10"
      />
    </svg>
  )
}

const SpeakerOff = () => {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M4 9v6h3.5L13 19.5v-15L7.5 9H4z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M16 10l5 5M21 10l-5 5"
      />
    </svg>
  )
}

const SoundToggle = () => {
  const [enabled, setEnabled] = useSoundEnabled()
  const label = enabled ? 'Выключить звук' : 'Включить звук'

  const toggleSound = () => {
    const next = !enabled
    setEnabled(next)

    if (next) {
      playClickSound()
    }
  }

  return (
    <ActionIcon
      className="sound-toggle"
      variant="outline"
      color={enabled ? 'pink' : 'gray'}
      size="lg"
      radius="md"
      aria-pressed={!enabled}
      aria-label={label}
      title={label}
      onClick={toggleSound}
    >
      {enabled ? <SpeakerOn /> : <SpeakerOff />}
    </ActionIcon>
  )
}

export default SoundToggle
