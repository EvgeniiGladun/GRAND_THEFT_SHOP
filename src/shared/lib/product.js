export const getMinPrice = (product) => {
  if (!product?.colors?.length) {
    return 0
  }

  return Math.min(...product.colors.map((color) => Number(color.price)))
}

export const isInStock = (product) => {
  return product.colors.some((color) => color.sizes.length > 0)
}

const rubleFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatPrice = (value) => {
  const amount = Number(value)
  return rubleFormat.format(Number.isFinite(amount) ? amount : 0)
}

export const getPreviewImage = (product) => {
  const cheapest = [...product.colors].sort(
    (left, right) => Number(left.price) - Number(right.price)
  )[0]

  return cheapest?.images?.[0] || ''
}

export const findColor = (product, colorId) => {
  if (!product) {
    return null
  }

  return (
    product.colors.find((color) => String(color.id) === String(colorId)) || null
  )
}

export const getProductPath = (item) => {
  const params = new URLSearchParams({
    color: String(item.colorId),
    size: String(item.sizeId),
  })

  return `/product/${item.productId}?${params.toString()}`
}

export const getFallbackColor = (product) => {
  return (
    product.colors.find((color) => color.sizes.length > 0) ||
    product.colors[0] ||
    null
  )
}
