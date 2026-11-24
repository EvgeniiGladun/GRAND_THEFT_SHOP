export const clampQuantity = (value) => {
  const parsed = Math.floor(Number(value))

  if (!Number.isFinite(parsed)) {
    return 1
  }

  return Math.max(1, parsed)
}
