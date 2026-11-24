import { Alert, Card, SimpleGrid, Text, Title } from '@mantine/core'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCategories } from 'entities/category'
import { getProducts, getSizes } from 'shared/api'
import { cn, getPreviewImage } from 'shared/lib'
import { Money, SkeletonImage } from 'shared/ui'
import { CatalogSkeleton } from 'widgets/catalog-skeleton'
import '../catalog.css'
import FilterDock from './FilterDock'
import PreviewPanel from './PreviewPanel'

const gridBreakpoints = [
  { maxWidth: 1200, cols: 2 },
  { maxWidth: 'xs', cols: 1 },
]

const variantPrice = (product, selectedColors, selectedSizes) => {
  const matched = product.colors.filter((color) => {
    if (selectedColors.length > 0 && !selectedColors.includes(color.name)) {
      return false
    }

    if (
      selectedSizes.length > 0 &&
      !color.sizes.some((sizeId) => selectedSizes.includes(String(sizeId)))
    ) {
      return false
    }

    return true
  })
  const source = matched.length > 0 ? matched : product.colors

  if (source.length === 0) {
    return 0
  }

  return Math.min(...source.map((color) => Number(color.price)))
}

const CatalogPage = () => {
  const categories = useCategories()
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('category')
  const [products, setProducts] = useState([])
  const [sizes, setSizes] = useState([])
  const [status, setStatus] = useState('loading')
  const [query, setQuery] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState('asc')
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [previewId, setPreviewId] = useState(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([getProducts(), getSizes()])
      .then(([data, sizeList]) => {
        if (!cancelled) {
          setProducts(data)
          setSizes(sizeList)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const colorOptions = useMemo(() => {
    const seen = new Set()
    const list = []

    products.forEach((product) => {
      product.colors.forEach((color) => {
        if (!seen.has(color.name)) {
          seen.add(color.name)
          list.push(color.name)
        }
      })
    })

    return list
  }, [products])

  const visibleProducts = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const narrowed = selectedColors.length > 0 || selectedSizes.length > 0 || inStockOnly

    const matchesVariant = (color) => {
      if (selectedColors.length > 0 && !selectedColors.includes(color.name)) {
        return false
      }

      if (
        selectedSizes.length > 0 &&
        !color.sizes.some((sizeId) => selectedSizes.includes(String(sizeId)))
      ) {
        return false
      }

      if (inStockOnly && color.sizes.length === 0) {
        return false
      }

      return true
    }

    return products
      .filter((product) => !categoryId || String(product.categoryId) === categoryId)
      .filter((product) => product.name.toLowerCase().includes(needle))
      .filter((product) => !narrowed || product.colors.some(matchesVariant))
      .sort((left, right) => {
        const diff =
          variantPrice(left, selectedColors, selectedSizes) -
          variantPrice(right, selectedColors, selectedSizes)
        return sort === 'asc' ? diff : -diff
      })
  }, [products, query, inStockOnly, sort, categoryId, selectedColors, selectedSizes])

  const toggleValue = (selected, value) => {
    return selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
  }

  const activeCount =
    (query.trim() ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (sort !== 'asc' ? 1 : 0) +
    selectedColors.length +
    selectedSizes.length

  const previewProduct =
    visibleProducts.find((product) => product.id === previewId) || visibleProducts[0] || null

  if (status === 'loading') {
    return <CatalogSkeleton />
  }

  const activeCategory = categories.find((category) => String(category.id) === categoryId)

  return (
    <div className={cn('catalog-layout', visibleProducts.length === 0 && 'catalog-layout--empty')}>
      <section>
        <h1 className="catalog-layout__kicker">{activeCategory ? activeCategory.name : 'Одежда'}</h1>
        <p className="catalog-layout__note">Куртки, худи, футболки и другое</p>

        <div className="category-chips">
          <Link to="/" className={cn('chip', !categoryId && 'chip--active')}>
            Все
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/?category=${category.id}`}
              className={cn('chip', categoryId === String(category.id) && 'chip--active')}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {status === 'ready' && (
          <FilterDock
            query={query}
            onQueryChange={setQuery}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
            sort={sort}
            onSortChange={setSort}
            colors={colorOptions}
            selectedColors={selectedColors}
            onToggleColor={(name) => setSelectedColors((current) => toggleValue(current, name))}
            sizes={sizes}
            selectedSizes={selectedSizes}
            onToggleSize={(sizeId) =>
              setSelectedSizes((current) => toggleValue(current, String(sizeId)))
            }
            canReset={activeCount > 0}
            onReset={() => {
              setQuery('')
              setInStockOnly(false)
              setSort('asc')
              setSelectedColors([])
              setSelectedSizes([])
            }}
            activeCount={activeCount}
          />
        )}

        {status === 'error' && <Alert color="red">Не удалось загрузить товары.</Alert>}
        {status === 'ready' && visibleProducts.length === 0 && (
          <div className="catalog-empty">
            <img className="catalog-empty__image" src="/stars-blink.gif" alt="" />
            <p className="catalog-empty__caption">Ничего не найдено</p>
          </div>
        )}
        {status === 'ready' && visibleProducts.length > 0 && (
          <SimpleGrid cols={3} spacing="md" breakpoints={gridBreakpoints}>
            {visibleProducts.map((product) => (
              <Card
                key={product.id}
                className={cn('shop-card', previewProduct?.id === product.id && 'shop-card--preview')}
                component={Link}
                to={`/product/${product.id}`}
                padding="md"
                radius="md"
                withBorder
                onMouseEnter={() => setPreviewId(product.id)}
                onFocus={() => setPreviewId(product.id)}
              >
                <Card.Section>
                  <div className="shop-card__photo">
                    <SkeletonImage
                      src={getPreviewImage(product)}
                      alt={product.name}
                      height={180}
                      fit="contain"
                    />
                  </div>
                </Card.Section>
                <Title order={4} mt="md">
                  {product.name}
                </Title>
                <Text size="sm" color="dimmed">
                  {product.brand}
                </Text>
                <Text className="price-neon" mt={4}>
                  <Money value={variantPrice(product, selectedColors, selectedSizes)} />
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </section>
      {previewProduct && <PreviewPanel product={previewProduct} />}
    </div>
  )
}

export default CatalogPage
