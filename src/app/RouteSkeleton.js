import React from 'react'
import { matchPath } from 'react-router-dom'
import { useCart } from 'entities/cart'
import { CartSkeleton } from 'widgets/cart-skeleton'
import { CatalogSkeleton } from 'widgets/catalog-skeleton'
import { ProductSkeleton } from 'widgets/product-skeleton'

const RouteSkeleton = ({ pathname }) => {
  const { items } = useCart()

  if (matchPath({ path: '/product/:id', end: true }, pathname)) {
    return <ProductSkeleton />
  }

  if (matchPath({ path: '/cart', end: true }, pathname)) {
    return <CartSkeleton count={items.length} />
  }

  return <CatalogSkeleton />
}

export default RouteSkeleton
