import { Alert, Button, Group, Paper, SimpleGrid, Text, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useCart } from 'entities/cart'
import { getProduct, getSizes } from 'shared/api'
import { cn, colorHex, findColor, getFallbackColor } from 'shared/lib'
import { Money, QuantityInput, Toast } from 'shared/ui'
import { ProductSkeleton } from 'widgets/product-skeleton'
import ImageGallery from './ImageGallery'
import '../product.css'

const ProductPage = () => {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [sizes, setSizes] = useState([])
  const [status, setStatus] = useState('loading')
  const [toast, setToast] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setProduct(null)
    setToast(null)
    setQuantity(1)

    Promise.all([getProduct(id), getSizes()])
      .then(([nextProduct, nextSizes]) => {
        if (cancelled) {
          return
        }

        setProduct(nextProduct)
        setSizes(nextSizes)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) {
          return
        }

        const message = String(error?.message || '')
        setStatus(message.includes('not found') ? 'notFound' : 'error')
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const requestedColor = findColor(product, searchParams.get('color'))
  const selectedColor = requestedColor || (product ? getFallbackColor(product) : null)
  const requestedSizeId = searchParams.get('size')
  const sizeIsAvailable =
    selectedColor &&
    requestedSizeId &&
    selectedColor.sizes.some((sizeId) => String(sizeId) === requestedSizeId)
  const selectedSize = sizeIsAvailable
    ? sizes.find((size) => String(size.id) === requestedSizeId) || null
    : null

  useEffect(() => {
    if (!product || !selectedColor) {
      return
    }

    const nextColor = String(selectedColor.id)
    const nextSize = selectedSize ? String(selectedSize.id) : null
    const currentColor = searchParams.get('color')
    const currentSize = searchParams.get('size')

    if (currentColor === nextColor && (currentSize || null) === nextSize) {
      return
    }

    const nextParams = { color: nextColor }
    if (nextSize) {
      nextParams.size = nextSize
    }

    setSearchParams(nextParams, { replace: true })
  }, [product, selectedColor, selectedSize, searchParams, setSearchParams])

  const selectColor = (colorId) => {
    const color = findColor(product, colorId)
    const nextParams = { color: String(colorId) }

    if (
      color &&
      selectedSize &&
      color.sizes.some((sizeId) => String(sizeId) === String(selectedSize.id))
    ) {
      nextParams.size = String(selectedSize.id)
    }

    setSearchParams(nextParams)
  }

  const selectSize = (sizeId) => {
    if (!selectedColor) {
      return
    }

    setSearchParams({
      color: String(selectedColor.id),
      size: String(sizeId),
    })
  }

  const handleAdd = () => {
    if (!product || !selectedColor || !selectedSize) {
      return
    }

    addItem({
      productId: product.id,
      colorId: selectedColor.id,
      sizeId: selectedSize.id,
      name: product.name,
      colorName: selectedColor.name,
      sizeName: selectedSize.name,
      price: Number(selectedColor.price),
      image: selectedColor.images[0] || '',
      quantity,
    })
    setToast({ id: Date.now(), message: 'Добавлено в корзину' })
    setQuantity(1)
  }

  if (status === 'loading') {
    return <ProductSkeleton />
  }

  if (status === 'notFound') {
    return (
      <Paper padding="xl" radius="md" withBorder>
        <Title order={2}>Товар не найден</Title>
        <Button component={Link} to="/" mt="md">
          Вернуться в каталог
        </Button>
      </Paper>
    )
  }

  if (status === 'error' || !product || !selectedColor) {
    return <Alert color="red">Не удалось загрузить товар.</Alert>
  }

  return (
    <article>
      <Button component={Link} to="/" variant="subtle" compact mb="md">
        Назад к списку
      </Button>
      <SimpleGrid cols={2} spacing="xl" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        <ImageGallery
          key={selectedColor.id}
          images={selectedColor.images}
          alt={product.name}
        />
        <div>
          <Title order={2} className="detail-title">
            {product.name}
          </Title>
          <Text color="dimmed">{product.brand}</Text>
          <Text className="price-neon" size="xl" mt="sm">
            <Money value={selectedColor.price} animate={false} />
          </Text>
          <Text mt="sm">{selectedColor.description}</Text>

          <div className="swatches">
            <Text className="swatches__label" size="xs" weight={700} mt="lg">
              Цвет: {selectedColor.name}
            </Text>
            <div className="swatches__list">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={cn('swatch', color.id === selectedColor.id && 'swatch--active')}
                  style={{ background: colorHex(color.name) }}
                  aria-label={color.name}
                  onClick={() => selectColor(color.id)}
                />
              ))}
            </div>
          </div>

          <Text weight={600} size="sm" mt="lg" mb="xs">
            Размер
          </Text>
          <Group spacing="xs">
            {sizes.map((size) => {
              const available = selectedColor.sizes.some(
                (sizeId) => String(sizeId) === String(size.id)
              )

              return (
                <Button
                  key={size.id}
                  type="button"
                  variant={selectedSize?.id === size.id ? 'filled' : 'default'}
                  disabled={!available}
                  onClick={() => selectSize(size.id)}
                >
                  {size.name}
                </Button>
              )
            })}
          </Group>

          <Group align="flex-end" mt="lg" spacing="sm">
            <QuantityInput value={quantity} onChange={setQuantity} />
            <Button type="button" onClick={handleAdd} disabled={!selectedSize}>
              В корзину
            </Button>
          </Group>
        </div>
      </SimpleGrid>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </article>
  )
}

export default ProductPage
