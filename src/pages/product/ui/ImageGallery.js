import { Text } from '@mantine/core'
import React from 'react'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SkeletonImage } from 'shared/ui'
import 'swiper/css'
import 'swiper/css/pagination'

const ImageGallery = ({ images, alt }) => {
  const frames = images || []

  if (!frames.length) {
    return (
      <Text color="dimmed" align="center">
        Нет изображения
      </Text>
    )
  }

  return (
    <div className="image-gallery">
      <Swiper
        modules={[Pagination]}
        pagination={frames.length > 1 ? { clickable: true } : false}
        slidesPerView={1}
        spaceBetween={0}
        allowTouchMove={frames.length > 1}
        grabCursor={frames.length > 1}
      >
        {frames.map((src, index) => (
          <SwiperSlide key={src}>
            <SkeletonImage
              src={src}
              alt={`${alt}, фото ${index + 1}`}
              height={360}
              fit="contain"
              fixed={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ImageGallery
