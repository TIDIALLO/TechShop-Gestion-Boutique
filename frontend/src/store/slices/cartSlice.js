import { createSlice } from "@reduxjs/toolkit"

const getSavedCart = () => {
  try {
    const cart = localStorage.getItem("client_cart")
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

const saveCart = items => {
  localStorage.setItem("client_cart", JSON.stringify(items))
}

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: getSavedCart(),
  },

  reducers: {
    addToCart: (state, { payload }) => {
      const existingProduct = state.items.find(
        item => item.id === payload.id
      )
      const maxStock = Number(payload.quantity)
      const hasStockLimit = !Number.isNaN(maxStock)

      if (existingProduct) {
        if (!hasStockLimit || existingProduct.cartQuantity < maxStock) {
          existingProduct.cartQuantity += 1
        }
      } else {
        state.items.push({
          ...payload,
          cartQuantity: 1,
        })
      }

      saveCart(state.items)
    },

    increaseQuantity: (state, { payload }) => {
      const product = state.items.find(
        item => item.id === payload
      )
      const maxStock = Number(product?.quantity)
      const hasStockLimit = !Number.isNaN(maxStock)

      if (product && (!hasStockLimit || product.cartQuantity < maxStock)) {
        product.cartQuantity += 1
      }

      saveCart(state.items)
    },

    decreaseQuantity: (state, { payload }) => {
      const product = state.items.find(
        item => item.id === payload
      )

      if (product && product.cartQuantity > 1) {
        product.cartQuantity -= 1
      }

      saveCart(state.items)
    },

    removeFromCart: (state, { payload }) => {
      state.items = state.items.filter(
        item => item.id !== payload
      )

      saveCart(state.items)
    },

    clearCart: state => {
      state.items = []
      saveCart(state.items)
    },
  },
})

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer