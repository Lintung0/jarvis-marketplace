import { createBrowserRouter } from 'react-router'
import Root from './components/Root'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import SellerProfile from './pages/SellerProfile'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import SearchResults from './pages/SearchResults'
import Account from './pages/Account'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'listings', Component: ProductListing },
      { path: 'listings/:category', Component: ProductListing },
      { path: 'product/:id', Component: ProductDetail },
      { path: 'seller/:id', Component: SellerProfile },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'search', Component: SearchResults },
      { path: 'account', Component: Account },
      { path: '*', Component: NotFound },
    ],
  },
])
