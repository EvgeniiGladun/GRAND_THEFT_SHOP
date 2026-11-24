import { Alert, Button, TextInput } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from 'entities/cart'
import { usePromo } from 'features/apply-promo'
import { cn, colorHex, formatItemCount, getProductPath } from 'shared/lib'
import { Money, QuantityInput, SkeletonImage } from 'shared/ui'
import '../cart.css'

const CartPage = () => {
  const { items, total, setQuantity, removeItem } = useCart()
  const {
    code,
    setCode,
    promo,
    promoError,
    discount,
    payable,
    applyPromo,
    clearPromo,
  } = usePromo(total)

  return (
    <section className={cn('cart-page', items.length === 0 && 'cart-page--empty')}>
      <header className="cart-head">
        <h1 className="cart-head__kicker">Корзина</h1>
        <p className="cart-head__note">{items.length === 0 ? 'Пока пусто' : formatItemCount(items.length)}</p>
      </header>

      {items.length === 0 && (
        <div className="cart-empty">
          <img className="cart-empty__image" src="/cart_flamingo.webp" alt="" />
          <p className="cart-empty__text">Корзина пуста.</p>
          <Button component={Link} to="/">
            Перейти в каталог
          </Button>
        </div>
      )}

      {items.length > 0 && (
        <div className="cart-layout">
          <ul className="cart-list">
            {items.map((item) => {
              const lineTotal = item.price * item.quantity

              return (
                <li key={item.key} className="cart-line shop-card">
                  <Link to={getProductPath(item)} className="cart-line__media">
                    <SkeletonImage src={item.image} alt="" height={92} fit="contain" />
                  </Link>
                  <div className="cart-line__body">
                    <div className="cart-line__top">
                      <Link to={getProductPath(item)} className="cart-line__name">
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        className="cart-remove"
                        aria-label={`Удалить ${item.name}`}
                        onClick={() => removeItem(item.key)}
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                    <div className="cart-line__meta">
                      <span className="cart-chip">
                        <span className="cart-chip__dot" style={{ background: colorHex(item.colorName) }} />
                        {item.colorName}
                      </span>
                      <span className="cart-chip">{item.sizeName}</span>
                      <span className="cart-line__unit">
                        <Money value={item.price} /> / шт.
                      </span>
                    </div>
                    <div className="cart-line__foot">
                      <div className="cart-qty">
                        <button
                          type="button"
                          className="cart-qty__button"
                          aria-label="Уменьшить количество"
                          disabled={item.quantity <= 1}
                          onClick={() => setQuantity(item.key, item.quantity - 1)}
                        >
                          −
                        </button>
                        <QuantityInput
                          aria-label="Количество"
                          label={null}
                          hideControls
                          size="xs"
                          value={item.quantity}
                          onChange={(value) => setQuantity(item.key, value)}
                          sx={{ width: 36 }}
                        />
                        <button
                          type="button"
                          className="cart-qty__button"
                          aria-label="Увеличить количество"
                          onClick={() => setQuantity(item.key, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="cart-line__sum">
                        <Money value={lineTotal} />
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <aside className="cart-summary">
            <p className="cart-summary__kicker">К оплате</p>
            <form className="cart-promo" onSubmit={applyPromo}>
              <TextInput
                label="Промокод"
                placeholder="SALE10 или FIX100"
                value={code}
                onChange={(event) => setCode(event.currentTarget.value)}
              />
              <div className="cart-promo__actions">
                <Button type="submit">Применить</Button>
                {promo && (
                  <Button type="button" variant="default" onClick={clearPromo}>
                    Сбросить
                  </Button>
                )}
              </div>
            </form>
            {promoError && (
              <Alert color="red" mt="sm">
                {promoError}
              </Alert>
            )}
            {promo && (
              <Alert color="green" mt="sm">
                {promo.code}: скидка {promo.label}
              </Alert>
            )}
            <dl className="cart-totals">
              <div className="cart-totals__row">
                <dt className="cart-totals__term">Сумма</dt>
                <dd className="cart-totals__value">
                  <Money value={total} />
                </dd>
              </div>
              <div className="cart-totals__row">
                <dt className="cart-totals__term">Скидка</dt>
                <dd className="cart-totals__value">
                  <Money value={discount} />
                </dd>
              </div>
              <div className="cart-totals__row cart-totals__row--payable">
                <dt className="cart-totals__term">Итого</dt>
                <dd className="cart-totals__value">
                  <Money value={payable} />
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      )}
    </section>
  )
}

export default CartPage
