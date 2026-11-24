import React, { useEffect, useRef, useState } from 'react'
import { formatPrice, prefersReducedMotion } from 'shared/lib'

const FRAME_MS = 1000 / 30
const HOLD_MS = 700
const FADE_MS = 550

const toCents = (value) => {
  const amount = Number(value)
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0
}

const stepToward = (current, target) => {
  const diff = target - current

  if (diff === 0) {
    return current
  }

  const rubles = Math.trunc(diff / 100)
  let rubleStep = Math.trunc(rubles / 19)

  if (rubleStep === 0 && rubles !== 0) {
    rubleStep = rubles > 0 ? 1 : -1
  }

  let step = rubleStep * 100

  if (step === 0) {
    step = diff > 0 ? 1 : -1
  }

  const next = current + step
  return diff > 0 ? Math.min(next, target) : Math.max(next, target)
}

const Money = ({ value, animate = true }) => {
  const target = toCents(value)
  const [shown, setShown] = useState(target)
  const [tone, setTone] = useState(null)
  const [fading, setFading] = useState(false)
  const shownRef = useRef(target)
  const skipRef = useRef(true)

  useEffect(() => {
    if (skipRef.current) {
      skipRef.current = false
      shownRef.current = target
      return undefined
    }

    const reduced = prefersReducedMotion()

    if (!animate || reduced || shownRef.current === target) {
      shownRef.current = target
      setShown(target)
      setTone(null)
      setFading(false)
      return undefined
    }

    setFading(false)
    setTone(target > shownRef.current ? 'gain' : 'loss')

    let frame = 0
    let fadeTimer = 0
    let last = 0
    let carry = 0
    let current = shownRef.current

    const tick = (now) => {
      if (!last) {
        last = now
      }

      carry += now - last
      last = now

      while (carry >= FRAME_MS && current !== target) {
        carry -= FRAME_MS
        current = stepToward(current, target)
      }

      if (current !== shownRef.current) {
        shownRef.current = current
        setShown(current)
      }

      if (current === target) {
        fadeTimer = window.setTimeout(() => {
          setFading(true)
          fadeTimer = window.setTimeout(() => {
            setTone(null)
            setFading(false)
          }, FADE_MS)
        }, HOLD_MS)
        return
      }

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(fadeTimer)
    }
  }, [target, animate])

  const label = formatPrice(shown / 100)
  const flashClass = tone
    ? `money__flash money__flash--${tone}${fading ? ' money__flash--out' : ''}`
    : ''

  return (
    <span className="money">
      <span className="money__figure">{label}</span>
      {tone ? (
        <span className={flashClass} aria-hidden="true">
          {label}
        </span>
      ) : null}
    </span>
  )
}

export default Money
