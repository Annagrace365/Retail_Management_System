// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import { DashboardStats } from '../types';
import { getUser, hasRole } from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import { RefreshCw, Users, Package, ShoppingCart, Truck, DollarSign, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getStats();
      setStats(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome back, {user?.username}!</p>
      {/* Example stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 shadow">
          <div className="flex items-center">
            <Users className="h-6 w-6 mr-2" />
            <p>Total Customers: {stats?.total_customers}</p>
          </div>
        </div>
        <div className="card p-4 shadow">
          <div className="flex items-center">
            <Package className="h-6 w-6 mr-2" />
            <p>Total Products: {stats?.total_products}</p>
          </div>
        </div>
        <div className="card p-4 shadow">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2" />
            <p>Total Orders: {stats?.total_orders}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
