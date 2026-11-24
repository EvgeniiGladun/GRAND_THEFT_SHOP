import { Button } from '@mantine/core'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from 'entities/cart'
import { SoundToggle } from 'features/sound'
import { cn } from 'shared/lib'
import { Money } from 'shared/ui'
import CartPeek from './CartPeek'
import Sidebar from './Sidebar'
import '../layout.css'

const Layout = ({ children }) => {
  const { count, total } = useCart()

  return (
    <div className="app-stage">
      <div className="shop-shell">
        <Sidebar />
        <div className="shop-main">
          <header className="shop-header">
            <div className="shop-header__bar">
              <Link to="/" className="shop-header__brand">
                grand theft shop
              </Link>
              <div className="shop-header__actions">
                <Button
                  className="cart-pill"
                  component={Link}
                  to="/cart"
                  variant="outline"
                  color="pink"
                  radius="md"
                >
                  Корзина ({count}) <Money value={total} />
                </Button>
                <SoundToggle />
              </div>
            </div>
            <CartPeek />
          </header>
          <div className="shop-content">{children}</div>
          <nav className="shop-tabbar" aria-label="Разделы">
            <NavLink to="/" end className={({ isActive }) => cn('shop-tabbar__tab', isActive && 'shop-tabbar__tab--active')}>
              Магазин
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => cn('shop-tabbar__tab', isActive && 'shop-tabbar__tab--active')}>
              Корзина ({count})
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Layout
