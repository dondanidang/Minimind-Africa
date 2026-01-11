'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getDisplayPrice, getPriceForQuantity } from '@/lib/utils'
import type { CartItem } from '@/types/cart'
import type { Product, ProductVariant } from '@/types/product'

type CartStore = {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, variantId?: string | null) => void
  addBundle: (product: Product, bundleQuantity: number, bundlePrice: number, variantSelections: Array<{ variant_id: string | null; variant_name: string }>) => void
  removeItem: (productId: string, variantId?: string | null) => void
  removeBundle: (productId: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void
  updateBundleQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity = 1, variantId = null) => {
        const items = get().items
        // Don't add regular items if there's already a bundle for this product
        const existingBundle = items.find(item => 
          item.product_id === product.id && item.is_bundle
        )
        if (existingBundle) {
          return // Bundle exists, don't add individual items
        }
        
        // Find existing item with same product and variant
        const existingItem = items.find(item => 
          item.product_id === product.id && item.variant_id === variantId && !item.is_bundle
        )
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product_id === product.id && item.variant_id === variantId && !item.is_bundle
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          const variant = variantId && product.variants 
            ? product.variants.find(v => v.id === variantId) 
            : undefined
          set({
            items: [...items, { 
              product_id: product.id, 
              variant_id: variantId,
              quantity, 
              product,
              variant,
            }],
          })
        }
      },
      
      addBundle: (product, bundleQuantity, bundlePrice, variantSelections) => {
        const items = get().items
        
        // Helper function to compare variant selections arrays
        const variantSelectionsMatch = (sel1: Array<{ variant_id: string | null; variant_name: string }> | undefined, sel2: Array<{ variant_id: string | null; variant_name: string }>) => {
          if (!sel1 || sel1.length !== sel2.length) return false
          return sel1.every((s1, index) => {
            const s2 = sel2[index]
            return s1.variant_id === s2.variant_id && s1.variant_name === s2.variant_name
          })
        }
        
        // Find existing bundle with same product, bundle quantity, and variant selections
        const existingBundle = items.find(item => 
          item.product_id === product.id && 
          item.is_bundle &&
          item.bundle_quantity === bundleQuantity &&
          variantSelectionsMatch(item.bundle_variant_selections, variantSelections)
        )
        
        if (existingBundle) {
          // Update existing bundle quantity (and remove any individual items)
          const filteredItems = items.filter(item => 
            item.product_id !== product.id || item.is_bundle
          )
          set({
            items: filteredItems.map(item =>
              item.product_id === product.id && 
              item.is_bundle &&
              item.bundle_quantity === bundleQuantity &&
              variantSelectionsMatch(item.bundle_variant_selections, variantSelections)
                ? { ...item, quantity: item.quantity + 1, bundle_price: bundlePrice }
                : item
            ),
          })
        } else {
          // Remove any individual items for this product (can't have both bundle and individual)
          // But keep other bundles with different configurations
          const filteredItems = items.filter(item => 
            item.product_id !== product.id || item.is_bundle
          )
          // Add new bundle
          set({
            items: [...filteredItems, { 
              product_id: product.id,
              variant_id: null,
              quantity: 1,
              product,
              is_bundle: true,
              bundle_quantity: bundleQuantity,
              bundle_price: bundlePrice,
              bundle_variant_selections: variantSelections,
            }],
          })
        }
      },
      
      removeItem: (productId, variantId = null) => {
        set({
          items: get().items.filter(item => 
            !(item.product_id === productId && item.variant_id === variantId && !item.is_bundle)
          ),
        })
      },
      
      removeBundle: (productId) => {
        set({
          items: get().items.filter(item => 
            !(item.product_id === productId && item.is_bundle)
          ),
        })
      },
      
      updateQuantity: (productId, quantity, variantId = null) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.product_id === productId && item.variant_id === variantId && !item.is_bundle
              ? { ...item, quantity } 
              : item
          ),
        })
      },
      
      updateBundleQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeBundle(productId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.product_id === productId && item.is_bundle
              ? { ...item, quantity } 
              : item
          ),
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => {
          if (!item.product) return total
          // If item is a bundle, use bundle_price
          if (item.is_bundle && item.bundle_price !== undefined) {
            return total + (item.bundle_price * item.quantity)
          }
          // Otherwise use regular/promo/variant price
          return total + getPriceForQuantity(item.product, item.quantity, item.variant || null)
        }, 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

