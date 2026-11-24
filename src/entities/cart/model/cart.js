import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { clampQuantity, readJsonStorage, writeJsonStorage } from 'shared/lib'

const STORAGE_KEY = 'cart'

const CartContext = createContext(null)

const itemKey = (item) => {
  return `${item.productId}-${item.colorId}-${item.sizeId}`
}

const isValidItem = (item) => {
  return (
    item &&
    item.productId != null &&
    item.colorId != null &&
    item.sizeId != null &&
    typeof item.name === 'string' &&
    typeof item.colorName === 'string' &&
    typeof item.sizeName === 'string' &&
    typeof item.image === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.quantity === 'number' &&
    item.quantity >= 1
  )
}

const loadCart = () => {
  const parsed = readJsonStorage(STORAGE_KEY, [])

  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed.filter(isValidItem).map((item) => ({
    ...item,
    key: itemKey(item),
    quantity: clampQuantity(item.quantity),
  }))
}

const saveCart = (items) => {
  writeJsonStorage(STORAGE_KEY, items)
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'add': {
      const key = itemKey(action.item)
      const existing = state.find((item) => item.key === key)
      const amount = clampQuantity(action.item.quantity)

      if (existing) {
        return state.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + amount } : item
        )
      }

      return [...state, { ...action.item, key, quantity: amount }]
    }
    case 'setQuantity': {
      const quantity = clampQuantity(action.quantity)

      return state.map((item) =>
        item.key === action.key ? { ...item, quantity } : item
      )
    }
    case 'remove':
      return state.filter((item) => item.key !== action.key)
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const value = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return {
      items,
      count,
      total,
      addItem: (item) => {
        dispatch({ type: 'add', item })
      },
      setQuantity: (key, quantity) => {
        dispatch({ type: 'setQuantity', key, quantity })
      },
      removeItem: (key) => {
        dispatch({ type: 'remove', key })
      },
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}
