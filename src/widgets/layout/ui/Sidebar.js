import { Skeleton } from '@mantine/core'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCategories } from 'entities/category'
import { cn } from 'shared/lib'

const isCategoryActive = (pathname, search, categoryId) => {
  if (pathname !== '/') {
    return false
  }

  const current = new URLSearchParams(search).get('category')

  if (!categoryId) {
    return !current
  }

  return current === String(categoryId)
}

const Sidebar = () => {
  const categories = useCategories()
  const location = useLocation()
  const onAllProducts = isCategoryActive(location.pathname, location.search)
  const promo = (
    <>
      <p className="promo-card__kicker">neon drop</p>
      <p className="promo-card__title">Новые цвета уже в наличии</p>
      <span className="promo-card__cta">Смотреть →</span>
    </>
  )

  return (
    <aside className="shop-sidebar">
      <div className="wordmark">
        <Link to="/" className="wordmark__logo">
          <span className="wordmark__line">grand</span>
          <span className="wordmark__line">theft</span>
          <span className="wordmark__line">shop</span>
        </Link>
        <div className="wordmark__rule">каталог</div>
      </div>
      <nav className="side-nav" aria-label="Категории">
        <Link
          to="/"
          className={cn(
            'side-link',
            isCategoryActive(location.pathname, location.search) && 'side-link--active'
          )}
        >
          Все товары
        </Link>
        {categories.length === 0 &&
          [0, 1, 2, 3].map((id) => <Skeleton key={id} height={42} radius={12} />)}
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/?category=${category.id}`}
            className={cn(
              'side-link',
              isCategoryActive(location.pathname, location.search, category.id) && 'side-link--active'
            )}
          >
            {category.name}
          </Link>
        ))}
      </nav>
      {onAllProducts ? (
        <div className="promo-card promo-card--disabled" aria-disabled="true">
          {promo}
        </div>
      ) : (
        <Link to="/" className="promo-card">
          {promo}
        </Link>
      )}
    </aside>
  )
}

export default Sidebar
