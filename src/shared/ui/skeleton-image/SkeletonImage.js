import { Image, Skeleton } from '@mantine/core'
import React, { useState } from 'react'

const boundImages = new WeakSet()

const SkeletonImage = ({ src, alt, height = 220, fit = 'cover', fixed = true }) => {
  const [shownSrc, setShownSrc] = useState(src)
  const [status, setStatus] = useState(src ? 'loading' : 'error')

  if (src !== shownSrc) {
    setShownSrc(src)
    setStatus(src ? 'loading' : 'error')
  }

  const frameHeight = fixed || status === 'loading' ? height : 'auto'

  return (
    <Skeleton visible={status === 'loading'} height={frameHeight} radius="md">
      <Image
        key={src || 'empty'}
        src={src || undefined}
        alt={alt}
        width={fixed ? '100%' : 'auto'}
        height={frameHeight}
        fit={fit}
        radius="md"
        withPlaceholder
        styles={
          fixed
            ? undefined
            : {
                image: { maxWidth: '100%', maxHeight: 480 },
              }
        }
        imageRef={(node) => {
          if (!node || boundImages.has(node)) {
            return
          }

          boundImages.add(node)

          const mark = () => {
            setStatus(node.naturalWidth > 0 ? 'ready' : 'error')
          }

          if (node.complete) {
            mark()
            return
          }

          node.addEventListener('load', mark, { once: true })
          node.addEventListener('error', () => setStatus('error'), { once: true })
        }}
      />
    </Skeleton>
  )
}

export default SkeletonImage
