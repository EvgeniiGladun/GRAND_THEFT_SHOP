import { Group, SimpleGrid, Skeleton } from '@mantine/core'
import React from 'react'
import ProductCardSkeleton from './ProductCardSkeleton'

const CARDS = [0, 1, 2, 3, 4, 5]
const CHIPS = [52, 148, 140, 72, 118]

const gridBreakpoints = [
  { maxWidth: 1200, cols: 2 },
  { maxWidth: 'xs', cols: 1 },
]

const CatalogSkeleton = () => {
  return (
    <div className="catalog-layout" role="status" aria-label="Загрузка товаров">
      <section>
        <Skeleton height={32} width={160} radius="sm" />
        <Skeleton height={16} width={250} radius="xl" mt={6} />
        <div className="category-chips">
          {CHIPS.map((width) => (
            <Skeleton key={width} height={32} width={width} radius={999} />
          ))}
        </div>
        <div className="catalog-filters-skeleton">
          <Skeleton height={40} width={148} radius={999} />
        </div>
        <SimpleGrid cols={3} spacing="md" breakpoints={gridBreakpoints}>
          {CARDS.map((id) => (
            <ProductCardSkeleton key={id} />
          ))}
        </SimpleGrid>
      </section>
      <aside className="preview-panel" aria-hidden="true">
        <div className="preview-panel__photo">
          <Skeleton height={280} radius="md" />
        </div>
        <Skeleton height={28} width="62%" radius="sm" />
        <Skeleton height={22} width="34%" radius="xl" mt="sm" />
        <Skeleton height={12} radius="xl" mt="sm" />
        <Skeleton height={12} width="78%" radius="xl" mt={8} />
        <Skeleton height={12} width={96} radius="xl" mt="md" />
        <Group spacing={8} mt={8}>
          <Skeleton height={28} circle />
          <Skeleton height={28} circle />
        </Group>
      </aside>
    </div>
  )
}

export default CatalogSkeleton
