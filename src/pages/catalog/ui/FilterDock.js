import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from 'shared/lib'
import CatalogFilters from './CatalogFilters'

const PHONE_QUERY = '(max-width: 768px)'

const readMatch = (query) => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }

  return window.matchMedia(query).matches
}

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => readMatch(query))

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)

    update()
    media.addEventListener('change', update)

    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

const FilterDock = (props) => {
  const isPhone = useMediaQuery(PHONE_QUERY)
  const [open, setOpen] = useState(false)
  const [host, setHost] = useState(null)
  const launchRef = useRef(null)
  const closeRef = useRef(null)
  const layerRef = useRef(null)
  const wasOpen = useRef(false)

  useLayoutEffect(() => {
    setHost(document.querySelector('.shop-main'))
  }, [])

  useLayoutEffect(() => {
    const node = layerRef.current

    if (!node) {
      return undefined
    }

    if (!open) {
      node.setAttribute('inert', '')
    } else {
      node.removeAttribute('inert')
    }

    if (!host) {
      node.style.top = ''
      node.style.bottom = ''
      return undefined
    }

    const place = () => {
      const header = host.querySelector('.shop-header')
      const tabbar = host.querySelector('.shop-tabbar')
      const headerHeight = header?.getBoundingClientRect().height || 0
      const tabbarVisible = tabbar && getComputedStyle(tabbar).display !== 'none'
      const tabbarHeight = tabbarVisible ? tabbar.getBoundingClientRect().height : 0

      node.style.top = `${headerHeight}px`
      node.style.bottom = `${tabbarHeight}px`
    }

    place()
    window.addEventListener('resize', place)

    return () => {
      window.removeEventListener('resize', place)
      node.style.top = ''
      node.style.bottom = ''
    }
  }, [open, host, isPhone])

  useEffect(() => {
    const background = ['.shop-content', '.shop-header', '.shop-tabbar', '.shop-sidebar']
      .map((selector) => document.querySelector(selector))
      .filter(Boolean)
    const content = host?.querySelector('.shop-content')

    if (open) {
      background.forEach((node) => node.setAttribute('inert', ''))
      if (content) {
        content.style.overflow = 'hidden'
      }
      closeRef.current?.focus({ preventScroll: true })
    } else if (wasOpen.current) {
      launchRef.current?.focus({ preventScroll: true })
    }

    wasOpen.current = open

    return () => {
      background.forEach((node) => node.removeAttribute('inert'))
      if (content) {
        content.style.overflow = ''
      }
    }
  }, [open, host])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const sheet = (
    <div
      id="catalog-filters"
      ref={layerRef}
      className={cn(
        'catalog-filter-layer',
        isPhone ? 'is-phone' : 'is-side',
        open && 'is-open'
      )}
      aria-hidden={open ? undefined : true}
    >
      <button
        type="button"
        className="catalog-filter-layer__backdrop"
        aria-label="Закрыть фильтры"
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />
      <aside
        className="catalog-filter-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Фильтры"
      >
        <div className="catalog-filter-sheet__head">
          <span className="catalog-filter-sheet__grabber" aria-hidden="true" />
          <div className="catalog-filter-sheet__title-row">
            <h2 className="catalog-filter-sheet__title">Фильтры</h2>
            <button
              ref={closeRef}
              type="button"
              className="catalog-filter-sheet__close"
              aria-label="Закрыть фильтры"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
        <div className="catalog-filter-sheet__body">
          <CatalogFilters {...props} />
        </div>
      </aside>
    </div>
  )

  return (
    <>
      <div className={cn('catalog-filters-launch-wrap', isPhone ? 'is-phone' : 'is-side')}>
        <button
          ref={launchRef}
          type="button"
          className={cn('catalog-filters-launch', open && 'catalog-filters-launch--away')}
          aria-expanded={open}
          aria-controls="catalog-filters"
          tabIndex={open ? -1 : 0}
          onClick={() => setOpen(true)}
        >
          <svg className="catalog-filters-launch__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Фильтры
          {props.activeCount > 0 ? (
            <span className="catalog-filters-launch__count">{props.activeCount}</span>
          ) : null}
        </button>
      </div>
      {host ? createPortal(sheet, host) : null}
    </>
  )
}

export default FilterDock
