import { Text, Title } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { colorHex, getFallbackColor } from 'shared/lib'
import { Money, SkeletonImage } from 'shared/ui'

const PreviewPanel = ({ product }) => {
  const color = getFallbackColor(product)

  if (!color) {
    return null
  }

  return (
    <aside className="preview-panel">
      <div className="preview-panel__photo">
        <SkeletonImage
          src={color.images[0]}
          alt={product.name}
          height={280}
          fit="contain"
        />
      </div>
      <Title order={3} className="preview-panel__name">
        {product.name}
      </Title>
      <Text className="price-neon" size="xl">
        <Money value={color.price} animate={false} />
      </Text>
      <Text size="sm" color="dimmed" mt="xs">
        {color.description}
      </Text>
      <div className="swatches">
        <Text size="xs" weight={700} mt="md" className="swatches__label">
          Цвет: {color.name}
        </Text>
        <div className="swatches__list">
          {product.colors.map((item) => (
            <Link
              key={item.id}
              to={`/product/${product.id}?color=${item.id}`}
              className="swatch"
              style={{ background: colorHex(item.name) }}
              aria-label={item.name}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}

export default PreviewPanel
