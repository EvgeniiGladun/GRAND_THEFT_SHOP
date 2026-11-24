const COLOR_HEX = {
  черный: '#161616',
  белый: '#f4f4f5',
  серый: '#9ca3af',
  желтый: '#f5c542',
  синий: '#3b82f6',
  бежевый: '#d6c4a8',
  хаки: '#6b705c',
  графит: '#52525b',
}

export const colorHex = (name) => {
  return COLOR_HEX[name] || '#8b5cf6'
}
