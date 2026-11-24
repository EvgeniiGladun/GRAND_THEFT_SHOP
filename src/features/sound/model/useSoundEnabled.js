import { useEffect, useState } from 'react'
import { isSoundEnabled, setSoundEnabled, subscribeSound } from './sound'

export const useSoundEnabled = () => {
  const [enabled, setEnabled] = useState(isSoundEnabled)

  useEffect(() => subscribeSound(setEnabled), [])

  return [enabled, setSoundEnabled]
}
