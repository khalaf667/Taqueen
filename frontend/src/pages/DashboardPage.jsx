import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, salesRes, itemsRes] = await Promise.all([
        apiClient.get('/dashboard/overview?branchId=1'),
        apiClient.get('/dashboard/sales?branchId=1&period=day'),
        apiClient.get('/dashboard/top-items?branchId=1&limit=5')
      ]);

      setOverview(overviewRes.data.data);
      setSalesData(salesRes.data.data);
      setTopItems(itemsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold">Total Orders</h3>
          <p className="text-4xl font-bold text-orange-600 mt-2">{overview?.totalOrders || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold">Total Revenue</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{overview?.totalRevenue?.toFixed(2)} ر.س</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold">Active Tables</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{overview?.activeTables || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold">Pending Orders</h3>
          <p className="text-4xl font-bold text-red-600 mt-2">{overview?.pendingOrders || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#FF6B6B" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Selling Items</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topItems}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_sold" fill="#4ECDC4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Orders by Status</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-red-600">{overview?.pendingOrders || 0}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Today</p>
            <p className="text-3xl font-bold text-blue-600">{overview?.totalOrders || 0}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Revenue</p>
            <p className="text-3xl font-bold text-green-600">{overview?.totalRevenue?.toFixed(0)} ر.س</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
