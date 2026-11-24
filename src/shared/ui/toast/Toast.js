import { Notification } from '@mantine/core'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './toast.css'

const VISIBLE_MS = 2500
const GAP = 8

const readShell = () => {
  const shell = document.querySelector('.shop-shell')

  if (!shell) {
    return null
  }

  const rect = shell.getBoundingClientRect()
  const width = Math.min(340, Math.max(rect.width - 48, 0))

  return {
    top: rect.top,
    left: rect.left + (rect.width - width) / 2,
    width,
  }
}

const sameShell = (prev, next) => {
  return prev && next && prev.top === next.top && prev.left === next.left && prev.width === next.width
}

const Toast = ({ toast, onClose }) => {
  const onCloseRef = useRef(onClose)
  const toastRef = useRef(null)
  const [shell, setShell] = useState(null)
  const [height, setHeight] = useState(0)
  const [ready, setReady] = useState(false)
  onCloseRef.current = onClose

  useLayoutEffect(() => {
    if (!toast) {
      setShell(null)
      setHeight(0)
      setReady(false)
      return undefined
    }

    const place = () => {
      const next = readShell()
      setShell((prev) => (sameShell(prev, next) ? prev : next))
    }

    place()
    const node = document.querySelector('.shop-shell')
    const observer = new ResizeObserver(place)

    if (node) {
      observer.observe(node)
    }

    window.addEventListener('resize', place)

    const timer = window.setTimeout(() => {
      onCloseRef.current()
    }, VISIBLE_MS)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', place)
      window.clearTimeout(timer)
    }
  }, [toast])

  useLayoutEffect(() => {
    const node = toastRef.current

    if (!toast || !shell || !node) {
      return undefined
    }

    const measure = () => {
      const next = node.offsetHeight
      setHeight((prev) => (prev === next ? prev : next))
    }

    measure()
    setReady(true)
    const observer = new ResizeObserver(measure)
    observer.observe(node)

    return () => observer.disconnect()
  }, [toast, shell])

  if (!toast || !shell) {
    return null
  }

  const finalTop = Math.max(GAP, shell.top - GAP - height)
  const rise = Math.max(shell.top - finalTop, 0)
  const clip = ready && finalTop + height + GAP <= shell.top + 0.5
  const hostStyle = clip
    ? { top: 0, left: shell.left, width: shell.width, height: shell.top }
    : { top: ready ? finalTop : shell.top, left: shell.left, width: shell.width }

  return createPortal(
    <div className={clip ? 'toast-host toast-host--clip' : 'toast-host'} style={hostStyle}>
      <Notification
        ref={toastRef}
        key={toast.id}
        className={ready ? 'toast-host__toast toast-host__toast--in' : 'toast-host__toast'}
        style={ready ? { '--toast-rise': `${rise}px` } : undefined}
        color="green"
        radius="md"
        onClose={onClose}
      >
        {toast.message}
      </Notification>
    </div>,
    document.body
  )
}

export default Toast
