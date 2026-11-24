import React, { useEffect, useRef, useState } from 'react'
import { cn, prefersReducedMotion } from 'shared/lib'
import '../boot.css'

const FONT_WAIT_MS = 1200
const HOLD_MS = 2500
const LEAVE_MS = 560
const HOLD_REDUCED_MS = 700
const LEAVE_REDUCED_MS = 280

const BootScreen = ({ onDone }) => {
  const onDoneRef = useRef(onDone)
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)

  onDoneRef.current = onDone

  useEffect(() => {
    let alive = true
    let leaveTimer
    let doneTimer
    const reduced = prefersReducedMotion()
    const hold = reduced ? HOLD_REDUCED_MS : HOLD_MS
    const leave = reduced ? LEAVE_REDUCED_MS : LEAVE_MS

    const start = async () => {
      if (document.fonts?.load) {
        await Promise.race([
          document.fonts.load('64px Pricedown'),
          new Promise((resolve) => {
            window.setTimeout(resolve, FONT_WAIT_MS)
          }),
        ])
      }

      if (!alive) {
        return
      }

      setReady(true)
      leaveTimer = window.setTimeout(() => {
        if (alive) {
          setLeaving(true)
        }
      }, hold)
      doneTimer = window.setTimeout(() => {
        if (alive) {
          onDoneRef.current()
        }
      }, hold + leave)
    }

    start()

    return () => {
      alive = false
      window.clearTimeout(leaveTimer)
      window.clearTimeout(doneTimer)
    }
  }, [])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const className = cn('boot', ready && 'boot--ready', leaving && 'boot--leaving')

  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
      aria-label="Загрузка grand theft shop"
    >
      <div className="boot__glow" aria-hidden="true" />
      <div className="boot__mark" aria-hidden="true">
        <span className="boot__line">grand</span>
        <span className="boot__line">theft</span>
        <span className="boot__line">shop</span>
        <span className="boot__rule" />
        <span className="boot__shine-clip" aria-hidden="true">
          <i className="boot__shine" />
        </span>
      </div>
      <div className="boot__meter">
        <p className="boot__meter-label">загрузка</p>
        <div className="boot__track" aria-hidden="true">
          <div className="boot__fill" />
        </div>
      </div>
    </div>
  )
}

export default BootScreen
