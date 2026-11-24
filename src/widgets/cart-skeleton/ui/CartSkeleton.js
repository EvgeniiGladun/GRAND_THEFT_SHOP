import { Skeleton } from '@mantine/core'
import React from 'react'

const CartItemSkeleton = () => {
  return (
    <div className="cart-line shop-card" aria-hidden="true">
      <Skeleton height={92} radius="md" />
      <div className="cart-line__body">
        <Skeleton height={22} width="62%" radius="xl" />
        <Skeleton height={18} width="46%" radius="xl" />
        <Skeleton height={28} width={104} radius="md" />
      </div>
    </div>
  )
}

const CartSkeleton = ({ count = 1 }) => {
  const items = Array.from({ length: Math.min(Math.max(count, 0), 6) }, (_, id) => id)

  return (
    <section className="cart-page" role="status" aria-label="Загрузка корзины">
      <Skeleton height={32} width={140} radius="sm" />
      {items.length === 0 && <Skeleton height={112} radius="md" />}
      {items.length > 0 && (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((id) => (
              <CartItemSkeleton key={id} />
            ))}
          </div>
          <Skeleton height={240} radius="md" />
        </div>
      )}
    </section>
  )
}

export default CartSkeleton
