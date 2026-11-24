import { NumberInput } from '@mantine/core'
import React, { useState } from 'react'
import { clampQuantity } from 'shared/lib'

const QuantityInput = ({ value, onChange, ...props }) => {
  const [revision, setRevision] = useState(0)

  return (
    <NumberInput
      key={revision}
      label="Количество"
      min={1}
      step={1}
      value={value}
      onChange={(next) => {
        if (typeof next === 'number') {
          onChange(clampQuantity(next))
        }
      }}
      onBlur={(event) => {
        const raw = event.currentTarget.value.trim()
        const parsed = Math.floor(Number(raw))

        if (!raw || !Number.isFinite(parsed) || parsed < 1) {
          setRevision((item) => item + 1)
          return
        }

        onChange(clampQuantity(parsed))
      }}
      sx={{ width: 120 }}
      {...props}
    />
  )
}

export default QuantityInput
