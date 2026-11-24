const PROMOS = {
  SALE10: { type: 'percent', value: 10, label: '10%' },
  FIX100: { type: 'fixed', value: 100, label: '100.00' },
}

export const resolvePromo = (code) => {
  const normalized = code.trim().toUpperCase()
  const promo = PROMOS[normalized]

  if (!promo) {
    return null
  }

  return { code: normalized, ...promo }
}

export const getDiscount = (subtotal, promo) => {
  if (!promo || subtotal <= 0) {
    return 0
  }

  if (promo.type === 'percent') {
    return subtotal * (promo.value / 100)
  }

  return Math.min(promo.value, subtotal)
}
