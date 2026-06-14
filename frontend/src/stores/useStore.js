import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  setUser: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading })
}));

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  addOrder: (order) => set({ orders: [order, ...get().orders] }),
  updateOrder: (id, updates) => set({
    orders: get().orders.map(o => o.id === id ? { ...o, ...updates } : o)
  }),
  setLoading: (isLoading) => set({ isLoading })
}));

export const useTableStore = create((set, get) => ({
  tables: [],
  selectedTable: null,
  isLoading: false,

  setTables: (tables) => set({ tables }),
  selectTable: (table) => set({ selectedTable: table }),
  updateTableStatus: (id, status) => set({
    tables: get().tables.map(t => t.id === id ? { ...t, status } : t)
  }),
  setLoading: (isLoading) => set({ isLoading })
}));

export const usePOSStore = create((set, get) => ({
  cart: [],
  subtotal: 0,
  tax: 0,
  total: 0,

  addToCart: (item) => {
    const existing = get().cart.find(c => c.menuItemId === item.menuItemId);
    let newCart;
    if (existing) {
      newCart = get().cart.map(c =>
        c.menuItemId === item.menuItemId ? { ...c, quantity: c.quantity + item.quantity } : c
      );
    } else {
      newCart = [...get().cart, item];
    }
    set({ cart: newCart });
    calculateTotals(newCart);
  },

  removeFromCart: (menuItemId) => {
    const newCart = get().cart.filter(c => c.menuItemId !== menuItemId);
    set({ cart: newCart });
    calculateTotals(newCart);
  },

  updateQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      set({ cart: get().cart.filter(c => c.menuItemId !== menuItemId) });
    } else {
      set({
        cart: get().cart.map(c =>
          c.menuItemId === menuItemId ? { ...c, quantity } : c
        )
      });
    }
    calculateTotals(get().cart);
  },

  clearCart: () => {
    set({ cart: [], subtotal: 0, tax: 0, total: 0 });
  }
}));

function calculateTotals(cart) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = parseFloat((subtotal * 0.15).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));
  usePOSStore.setState({ subtotal, tax, total });
}
