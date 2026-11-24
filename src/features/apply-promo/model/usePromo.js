import { useState } from 'react'
import { getDiscount, resolvePromo } from 'shared/lib'

export const usePromo = (total) => {
  const [code, setCode] = useState('')
  const [promo, setPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const discount = getDiscount(total, promo)
  const payable = Math.max(0, total - discount)

  const applyPromo = (event) => {
    event.preventDefault()
    const nextPromo = resolvePromo(code)

    if (!nextPromo) {
      setPromo(null)
      setPromoError('Промокод не найден')
      return
    }

    setPromo(nextPromo)
    setPromoError('')
  }

  const clearPromo = () => {
    setPromo(null)
    setCode('')
    setPromoError('')
  }

  return {
    code,
    setCode,
    promo,
    promoError,
    discount,
    payable,
    applyPromo,
    clearPromo,
  }
}
