import React, { useState, useEffect } from 'react';
import { useOrderStore, usePOSStore, useTableStore } from '../stores/useStore';
import apiClient from '../services/api';
import { connectSocket } from '../services/socket';

const POSPage = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, tax, total } = usePOSStore();
  const { tables, selectTable, selectedTable, setTables } = useTableStore();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    connectSocket(localStorage.getItem('token'));
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, categoriesRes, tablesRes] = await Promise.all([
        apiClient.get('/menu/items?branchId=1'),
        apiClient.get('/menu/categories?branchId=1'),
        apiClient.get('/tables?branchId=1')
      ]);
      setMenuItems(itemsRes.data.data);
      setCategories(categoriesRes.data.data);
      setTables(tablesRes.data.data);
      if (categoriesRes.data.data.length > 0) {
        setSelectedCategory(categoriesRes.data.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (item) => {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
  };

  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      alert('Please add items to cart');
      return;
    }

    try {
      const response = await apiClient.post('/orders', {
        branchId: 1,
        tableId: selectedTable?.id,
        items: cart.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.price
        }))
      });
      alert('Order created successfully!');
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
    }
  };

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category_id === selectedCategory)
    : menuItems;

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Menu Section */}
      <div className="flex-1 p-4">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">POS System</h1>

        {/* Categories */}
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => handleAddItem(item)}
            >
              <h3 className="font-bold text-gray-800 mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="text-xl font-bold text-orange-600">{item.price} ر.س</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white shadow-lg p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Cart</h2>

        {/* Tables Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Select Table</label>
          <select
            value={selectedTable?.id || ''}
            onChange={(e) => {
              const table = tables.find(t => t.id === parseInt(e.target.value));
              selectTable(table);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          >
            <option value="">Select a table...</option>
            {tables.map(table => (
              <option key={table.id} value={table.id}>
                Table {table.table_number} ({table.capacity} seats)
              </option>
            ))}
          </select>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto mb-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items in cart</p>
          ) : (
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.menuItemId} className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800">{item.name}</span>
                    <button
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-orange-600">{item.price * item.quantity} ر.س</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="border-t pt-4 space-y-2 mb-4">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)} ر.س</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tax (15%):</span>
            <span>{tax.toFixed(2)} ر.س</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-orange-600 border-t pt-2">
            <span>Total:</span>
            <span>{total.toFixed(2)} ر.س</span>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleCreateOrder}
          disabled={cart.length === 0}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 mb-2"
        >
          Create Order
        </button>
        <button
          onClick={clearCart}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default POSPage;
