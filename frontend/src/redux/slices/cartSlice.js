import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//helper function to load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

//helper function to save cart to local Storage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

//fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          params: { userId, guestId },
        }
      );
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);

//add item to the cart for a new user or guest
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, size, color, guestId, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId,
          quantity,
          size,
          color,
          guestId,
          userId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    { productId, quantity, size, color, guestId, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId,
          quantity,
          size,
          color,
          guestId,
          userId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//remove an item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (
    { productId, size, color, guestId, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        data: { productId, size, color, guestId, userId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//merge guest cart into user cart
export const mergeCart = createAsyncThunk(
    "cart/mergeCart", 
    async ({ guestId, userId}, {rejectWithValue}) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
            { guestId, userId },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`, 
                },
            }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: loadCartFromStorage(),
        loading: false,
        error: null,
    },
    reducers: {
  clearCart: (state) => {
    state.cart = { products: [] };
    localStorage.removeItem("cart");
  },
  updateCartItemQuantityLocal: (state, action) => {
    const { productId, delta, size, color } = action.payload;
    const item = state.cart.products.find(
      (p) => p.productId === productId && p.size === size && p.color === color
    );
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity >= 1) {
        item.quantity = newQuantity;
        saveCartToStorage(state.cart);
      }
    }
  },
},

    extraReducers: (builder) => {
      builder
        .addCase(fetchCart.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
          state.loading = false;
          state.cart = action.payload;
          saveCartToStorage(action.payload);
        })
        .addCase(fetchCart.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Failed to fetch cart";
        })
        .addCase(addToCart.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
          state.loading = false;
          state.cart = action.payload;
          saveCartToStorage(action.payload);
        })
        .addCase(addToCart.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "Failed to add to cart";
        })
        .addCase(updateCartItemQuantity.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
          state.loading = false;
          state.cart = action.payload;
          saveCartToStorage(action.payload);
        })
        .addCase(updateCartItemQuantity.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "Failed to update the item quantity";
        })
        .addCase(removeFromCart.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(removeFromCart.fulfilled, (state, action) => {
          state.loading = false;
          state.cart = action.payload;
          saveCartToStorage(action.payload);
        })
        .addCase(removeFromCart.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "Failed to remove the item";
        })
        .addCase(mergeCart.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(mergeCart.fulfilled, (state, action) => {
          state.loading = false;
              saveCartToStorage(action.payload);
        })
        .addCase(mergeCart.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "Failed to merge item";
        });
    },
});

export const { clearCart} = cartSlice.actions;
export default cartSlice.reducer;