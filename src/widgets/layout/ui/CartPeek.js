import { useMediaQuery } from '@mantine/hooks'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from 'entities/cart'
import { cn, getProductPath, prefersReducedMotion, readStorage, writeStorage } from 'shared/lib'
import { Money } from 'shared/ui'

const PEEK_KEY = 'cart-peek'
const DRAG_SLOP = 6

const stopFrame = (frameRef) => {
  if (frameRef.current) {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
  }
}

const glideList = (list, frameRef, velocity) => {
  if (Math.abs(velocity) < 0.05) {
    return
  }

  if (prefersReducedMotion()) {
    return
  }

  const speed = Math.max(-2.2, Math.min(2.2, velocity))
  let last = performance.now()
  let current = speed

  const tick = (now) => {
    const dt = Math.min(34, now - last)
    last = now
    list.scrollLeft += current * dt
    current *= Math.pow(0.94, dt / 16)

    const max = list.scrollWidth - list.clientWidth
    const atEdge = list.scrollLeft <= 0 || list.scrollLeft >= max - 0.5

    if (Math.abs(current) < 0.02 || atEdge) {
      frameRef.current = 0
      return
    }

    frameRef.current = requestAnimationFrame(tick)
  }

  frameRef.current = requestAnimationFrame(tick)
}

const loadPeekOpen = () => {
  return readStorage(PEEK_KEY) === '1'
}

const savePeekOpen = (open) => {
  writeStorage(PEEK_KEY, open ? '1' : '0')
}

const CartPeek = () => {
  const { items, count, removeItem } = useCart()
  const location = useLocation()
  const isWide = useMediaQuery('(min-width: 769px)')
  const [open, setOpen] = useState(loadPeekOpen)
  const [featuredKey, setFeaturedKey] = useState(null)
  const prevCount = useRef(count)
  const prevItems = useRef(items)
  const listRef = useRef(null)
  const dragRef = useRef(null)
  const frameRef = useRef(0)
  const [dragging, setDragging] = useState(false)
  const onCart = location.pathname === '/cart'
  const interactive = open && !onCart && isWide

  useEffect(() => {
    savePeekOpen(open)
  }, [open])

  useEffect(() => () => stopFrame(frameRef), [])

  useEffect(() => {
    const list = listRef.current

    if (!list) {
      return undefined
    }

    const onWheel = (event) => {
      const max = list.scrollWidth - list.clientWidth

      if (max <= 0) {
        return
      }

      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY

      if (!delta) {
        return
      }

      const atStart = list.scrollLeft <= 0 && delta < 0
      const atEnd = list.scrollLeft >= max - 1 && delta > 0

      if (atStart || atEnd) {
        return
      }

      event.preventDefault()
      stopFrame(frameRef)
      list.scrollLeft += delta
    }

    list.addEventListener('wheel', onWheel, { passive: false })

    return () => list.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const previousCount = prevCount.current
    const previousItems = prevItems.current
    prevCount.current = count
    prevItems.current = items

    if (count === 0) {
      setOpen(false)
      return
    }

    if (count > previousCount && location.pathname !== '/cart') {
      const changed = items.find((item) => {
        const before = previousItems.find((entry) => entry.key === item.key)
        return !before || before.quantity !== item.quantity
      })

      if (changed) {
        setFeaturedKey(changed.key)
      }

      setOpen(true)
    }
  }, [count, items, location.pathname])

  const ordered = [...items].sort((left, right) => {
    if (left.key === featuredKey) {
      return -1
    }

    if (right.key === featuredKey) {
      return 1
    }

    return 0
  })

  const finishDrag = (event) => {
    const drag = dragRef.current

    if (!drag || drag.pointerId !== event.pointerId) {
      return
    }

    dragRef.current = null
    setDragging(false)

    const list = listRef.current

    if (!list || !drag.moved) {
      return
    }

    const blockClick = (clickEvent) => {
      clickEvent.preventDefault()
      clickEvent.stopPropagation()
    }

    document.addEventListener('click', blockClick, true)
    window.setTimeout(() => document.removeEventListener('click', blockClick, true), 50)
    glideList(list, frameRef, -drag.velocity)
  }

  const onPointerDown = (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
      return
    }

    if (event.button !== 0) {
      return
    }

    const list = listRef.current

    if (!list || list.scrollWidth <= list.clientWidth) {
      return
    }

    stopFrame(frameRef)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: list.scrollLeft,
      moved: false,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
    }
  }

  const onPointerMove = (event) => {
    const drag = dragRef.current
    const list = listRef.current

    if (!drag || !list || drag.pointerId !== event.pointerId) {
      return
    }

    const dx = event.clientX - drag.startX

    if (!drag.moved) {
      if (Math.abs(dx) < DRAG_SLOP) {
        return
      }

      drag.moved = true
      setDragging(true)

      if (!list.hasPointerCapture(event.pointerId)) {
        list.setPointerCapture(event.pointerId)
      }
    }

    const now = performance.now()
    const dt = now - drag.lastTime

    if (dt > 0) {
      const instant = (event.clientX - drag.lastX) / dt
      drag.velocity = drag.velocity * 0.65 + instant * 0.35
    }

    drag.lastX = event.clientX
    drag.lastTime = now
    list.scrollLeft = drag.scrollLeft - dx
  }

  const className = cn('cart-peek', open && 'cart-peek--open', open && onCart && 'cart-peek--blurred')
  const listClassName = cn('cart-peek__list', dragging && 'cart-peek__list--dragging')

  return (
    <aside
      className={className}
      aria-label="Быстрый просмотр корзины"
      aria-hidden={interactive ? undefined : true}
      inert={interactive ? undefined : ''}
    >
      <div className="cart-peek__clip">
        <div className="cart-peek__bar">
          <ul
            ref={listRef}
            className={listClassName}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onDragStart={(event) => event.preventDefault()}
          >
            {ordered.map((item) => (
              <li key={item.key} className="cart-peek__item">
                <Link to={getProductPath(item)} className="cart-peek__link" draggable="false">
                  {item.image ? (
                    <img className="cart-peek__photo" src={item.image} alt="" draggable="false" />
                  ) : (
                    <span className="cart-peek__photo" />
                  )}
                  <div className="cart-peek__meta">
                    <p className="cart-peek__name">{item.name}</p>
                    <p className="cart-peek__spec">
                      {item.colorName} · {item.sizeName} · {item.quantity} шт.
                    </p>
                  </div>
                  <p className="cart-peek__price">
                    <Money value={item.price * item.quantity} />
                  </p>
                </Link>
                <button
                  type="button"
                  className="cart-peek__remove"
                  aria-label={`Удалить ${item.name}`}
                  onClick={() => removeItem(item.key)}
                >
                  <span className="cart-peek__remove-label">Удалить</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default CartPeek
