import React, { useState, useEffect } from 'react';
import { getSocket } from '../services/socket';
import apiClient from '../services/api';

const KDSPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = getSocket();

  useEffect(() => {
    fetchOrders();
    
    if (socket) {
      socket.on('order:new', (data) => {
        console.log('New order received:', data);
        fetchOrders();
      });

      socket.on('order:updated', (data) => {
        console.log('Order updated:', data);
        fetchOrders();
      });
    }

    return () => {
      if (socket) {
        socket.off('order:new');
        socket.off('order:updated');
      }
    };
  }, [socket]);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/orders?branchId=1&status=PENDING');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Kitchen Display System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map(order => (
          <div
            key={order.id}
            className={`rounded-lg p-6 shadow-lg ${
              order.status === 'PENDING'
                ? 'bg-red-500'
                : order.status === 'PREPARING'
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
          >
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2">{order.order_number}</h2>
              <p className="text-lg mb-4">Table {order.table_id || 'N/A'}</p>
              
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Items:</h3>
                {/* Items would be populated from order items */}
              </div>

              <div className="flex gap-2">
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                    className="bg-white text-red-500 font-bold px-4 py-2 rounded hover:bg-gray-200"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'READY')}
                    className="bg-white text-yellow-500 font-bold px-4 py-2 rounded hover:bg-gray-200"
                  >
                    Mark Ready
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center text-white text-2xl mt-20">
          No pending orders
        </div>
      )}
    </div>
  );
};

export default KDSPage;
