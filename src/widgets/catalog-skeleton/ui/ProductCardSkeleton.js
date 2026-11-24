import { Card, Skeleton } from '@mantine/core'
import React from 'react'

const ProductCardSkeleton = () => {
  return (
    <Card className="shop-card" padding="md" radius="md" withBorder aria-hidden="true">
      <Card.Section>
        <div className="shop-card__photo">
          <Skeleton height={180} radius="md" />
        </div>
      </Card.Section>
      <Skeleton height={22} width="70%" radius="xl" mt="md" />
      <Skeleton height={14} width="42%" radius="xl" mt={6} />
      <Skeleton height={16} width="28%" radius="xl" mt={6} />
    </Card>
  )
}

export default ProductCardSkeleton
