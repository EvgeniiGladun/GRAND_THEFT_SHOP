export const readStorage = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Хранилище может быть недоступно.
  }
}

export const readJsonStorage = (key, fallback) => {
  const raw = readStorage(key)

  if (!raw) {
    return fallback
  }

  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const writeJsonStorage = (key, value) => {
  writeStorage(key, JSON.stringify(value))
}
