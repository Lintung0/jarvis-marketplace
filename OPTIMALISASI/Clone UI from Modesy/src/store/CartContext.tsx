import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Product } from '../data/products'

interface CartItem {
  product: Product
  quantity: number
  size?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, size?: string) => void
  removeFromCart: (productId: number) => void
  updateQty: (productId: number, qty: number) => void
  clearCart: () => void
  total: number
  count: number
  wishlist: number[]
  toggleWishlist: (id: number) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([3, 7])

  const addToCart = (product: Product, size?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1, size }]
    })
  }

  const removeFromCart = (productId: number) => setItems(prev => prev.filter(i => i.product.id !== productId))

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => setItems([])

  const toggleWishlist = (id: number) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, count, wishlist, toggleWishlist }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
