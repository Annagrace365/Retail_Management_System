import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { dashboardAPI } from '../services/api';
import { DashboardStats } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { getUser, hasRole } from '../utils/auth';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      setStats(response.data);
      setError('');
    } catch (error: any) {
      setError('Failed to load dashboard data');
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getRoleBasedStats = () => {
    if (!stats) return [];
    
    const baseStats = [
      {
        name: 'Total Customers',
        value: stats.total_customers,
        icon: Users,
        color: 'bg-blue-500',
        change: '+12%',
        changeType: 'positive' as const,
      },
      {
        name: 'Total Products',
        value: stats.total_products,
        icon: Package,
        color: 'bg-green-500',
        change: '+8%',
        changeType: 'positive' as const,
      },
    ];

    // Admin and Staff can see all stats
    if (hasRole('admin') || hasRole('staff')) {
      return [
        ...baseStats,
        {
          name: 'Total Orders',
          value: stats.total_orders,
          icon: ShoppingCart,
          color: 'bg-purple-500',
          change: '+15%',
          changeType: 'positive' as const,
        },
        {
          name: 'Total Revenue',
          value: formatCurrency(stats.total_revenue),
          icon: DollarSign,
          color: 'bg-yellow-500',
          change: '+22%',
          changeType: 'positive' as const,
        },
        {
          name: 'Total Suppliers',
          value: stats.total_suppliers,
          icon: Truck,
          color: 'bg-indigo-500',
          change: '+5%',
          changeType: 'positive' as const,
        },
        {
          name: 'Low Stock Products',
          value: stats.low_stock_products,
          icon: AlertTriangle,
          color: stats.low_stock_products > 0 ? 'bg-red-500' : 'bg-green-500',
          change: stats.low_stock_products > 0 ? 'Needs Attention' : 'All Good',
          changeType: stats.low_stock_products > 0 ? 'negative' as const : 'positive' as const,
        },
      ];
    }

    // Inventory Manager sees product-focused stats
    if (hasRole('inventory_manager')) {
      return [
        ...baseStats,
        {
          name: 'Low Stock Products',
          value: stats.low_stock_products,
          icon: AlertTriangle,
          color: stats.low_stock_products > 0 ? 'bg-red-500' : 'bg-green-500',
          change: stats.low_stock_products > 0 ? 'Needs Attention' : 'All Good',
          changeType: stats.low_stock_products > 0 ? 'negative' as const : 'positive' as const,
        },
        {
          name: 'Total Suppliers',
          value: stats.total_suppliers,
          icon: Truck,
          color: 'bg-indigo-500',
          change: '+5%',
          changeType: 'positive' as const,
        },
      ];
    }

    return baseStats;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadStats}
          className="btn btn-primary"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  const roleBasedStats = getRoleBasedStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.username}! Here's what's happening with your retail business.
          </p>
        </div>
        <button
          onClick={loadStats}
          className="btn btn-secondary"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {roleBasedStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      {stats?.recent_orders && stats.recent_orders.length > 0 && (hasRole('admin') || hasRole('staff')) && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.slice(0, 5).map((order) => (
                  <tr key={order.order_id}>
                    <td className="font-medium">#{order.order_id}</td>
                    <td>{order.customer_name}</td>
                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="font-medium">{formatCurrency(order.amount)}</td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Low Stock Alert */}
      {stats && stats.low_stock_products > 0 && (
        <div className="card border-l-4 border-red-500 bg-red-50">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">
                Low Stock Alert
              </h3>
              <p className="text-red-700">
                {stats.low_stock_products} product{stats.low_stock_products !== 1 ? 's' : ''} 
                {' '}have low stock levels and need restocking.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hasRole('admin') || hasRole('staff') ? (
          <>
            <button className="card hover:shadow-md transition-shadow text-left">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Create Order</h3>
                  <p className="text-sm text-gray-600">Start a new order</p>
                </div>
              </div>
            </button>
            <button className="card hover:shadow-md transition-shadow text-left">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Add Customer</h3>
                  <p className="text-sm text-gray-600">Register new customer</p>
                </div>
              </div>
            </button>
          </>
        ) : null}
        
        <button className="card hover:shadow-md transition-shadow text-left">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Manage Products</h3>
              <p className="text-sm text-gray-600">Update inventory</p>
            </div>
          </div>
        </button>
        
        <button className="card hover:shadow-md transition-shadow text-left">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900">Suppliers</h3>
              <p className="text-sm text-gray-600">Manage suppliers</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;