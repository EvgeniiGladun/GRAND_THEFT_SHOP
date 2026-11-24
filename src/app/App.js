import { MantineProvider } from '@mantine/core'
import React, { Suspense, lazy, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from 'entities/cart'
import { shopTheme } from 'shared/config'
import BootScreen from 'widgets/boot'
import Layout from 'widgets/layout'
import RouteSkeleton from './RouteSkeleton'

const CatalogPage = lazy(() => import('pages/catalog'))
const ProductPage = lazy(() => import('pages/product'))
const CartPage = lazy(() => import('pages/cart'))

const Pages = () => {
  const location = useLocation()

  return (
    <Suspense fallback={<RouteSkeleton pathname={location.pathname} />}>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Suspense>
  )
}

const App = () => {
  const [booting, setBooting] = useState(true)

  return (
    <MantineProvider theme={shopTheme} withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <CartProvider>
          <div aria-hidden={booting || undefined}>
            <Layout>
              <Pages />
            </Layout>
          </div>
          {booting ? <BootScreen onDone={() => setBooting(false)} /> : null}
        </CartProvider>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
