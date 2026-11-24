import { Checkbox, Select, TextInput } from '@mantine/core'
import React from 'react'
import { cn, colorHex } from 'shared/lib'

const CatalogFilters = ({
  query,
  onQueryChange,
  inStockOnly,
  onInStockChange,
  sort,
  onSortChange,
  colors,
  selectedColors,
  onToggleColor,
  sizes,
  selectedSizes,
  onToggleSize,
  canReset,
  onReset,
}) => {
  return (
    <div className="catalog-filters">
      <div className="catalog-filters__controls">
        <TextInput
          className="catalog-filters__search"
          label="Поиск"
          placeholder="Название"
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
        />
        <Checkbox
          className="catalog-filters__stock"
          label="В наличии"
          checked={inStockOnly}
          onChange={(event) => onInStockChange(event.currentTarget.checked)}
        />
        <Select
          className="catalog-filters__sort"
          label="Сортировка"
          value={sort}
          onChange={(value) => onSortChange(value || 'asc')}
          data={[
            { value: 'asc', label: 'Сначала дешевле' },
            { value: 'desc', label: 'Сначала дороже' },
          ]}
        />
      </div>

      <div className="catalog-filters__group">
        <p className="catalog-filters__label" id="catalog-filter-colors">
          Цвет
        </p>
        <div className="catalog-filters__list" role="group" aria-labelledby="catalog-filter-colors">
          {colors.map((name) => {
            const active = selectedColors.includes(name)

            return (
              <button
                key={name}
                type="button"
                className={cn('filter-color', active && 'filter-color--active')}
                aria-pressed={active}
                onClick={() => onToggleColor(name)}
              >
                <span className="filter-color__dot" style={{ background: colorHex(name) }} />
                {name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="catalog-filters__group">
        <p className="catalog-filters__label" id="catalog-filter-sizes">
          Размер
        </p>
        <div className="catalog-filters__list" role="group" aria-labelledby="catalog-filter-sizes">
          {sizes.map((size) => {
            const key = String(size.id)
            const active = selectedSizes.includes(key)

            return (
              <button
                key={size.id}
                type="button"
                className={cn('filter-size', active && 'filter-size--active')}
                aria-pressed={active}
                onClick={() => onToggleSize(size.id)}
              >
                {size.name}
              </button>
            )
          })}
        </div>
      </div>

      {canReset ? (
        <button type="button" className="catalog-filters__reset" onClick={onReset}>
          Сбросить
        </button>
      ) : null}
    </div>
  )
}

export default CatalogFilters
