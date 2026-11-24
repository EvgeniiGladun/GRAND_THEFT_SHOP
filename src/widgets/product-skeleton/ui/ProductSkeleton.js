import { Group, SimpleGrid, Skeleton } from '@mantine/core'
import React from 'react'

const COLORS = [0, 1, 2]
const SIZES = [0, 1, 2, 3, 4, 5]

const ProductSkeleton = () => {
  return (
    <article role="status" aria-label="Загрузка товара">
      <Skeleton height={30} width={148} radius="sm" mb="md" />
      <SimpleGrid cols={2} spacing="xl" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        <div>
          <Skeleton height={360} radius="md" />
          <Group mt="sm">
            <Skeleton height={36} width={84} radius="sm" />
            <Skeleton height={14} width={36} radius="xl" />
            <Skeleton height={36} width={84} radius="sm" />
          </Group>
        </div>
        <div>
          <Skeleton height={36} width="55%" radius="sm" />
          <Skeleton height={14} width="30%" radius="xl" mt="sm" />
          <Skeleton height={24} width="24%" radius="xl" mt="sm" />
          <Skeleton height={14} radius="xl" mt="sm" />
          <Skeleton height={14} width="75%" radius="xl" mt={8} />
          <Skeleton height={12} width={120} radius="xl" mt="lg" />
          <Group spacing={8} mt={8}>
            {COLORS.map((id) => (
              <Skeleton key={id} height={28} circle />
            ))}
          </Group>
          <Skeleton height={14} width={64} radius="xl" mt="lg" mb="xs" />
          <Group spacing="xs">
            {SIZES.map((id) => (
              <Skeleton key={id} height={36} width={52} radius="sm" />
            ))}
          </Group>
          <Skeleton height={36} width={128} radius="sm" mt="lg" />
        </div>
      </SimpleGrid>
    </article>
  )
}

export default ProductSkeleton
