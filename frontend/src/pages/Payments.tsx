import React, { useState, useEffect } from 'react';
import { Plus, Search, CreditCard, User, DollarSign, Calendar, Filter } from 'lucide-react';
import { paymentsAPI, ordersAPI } from '../services/api';
import { Payment, Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    order: '',
    amount: '',
    payment_mode: 'cash' as 'cash' | 'card' | 'upi' | 'bank_transfer',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, ordersRes] = await Promise.all([
        paymentsAPI.getAll(),
        ordersAPI.getAll(),
      ]);

      const paymentsData = Array.isArray(paymentsRes.data) ? paymentsRes.data : paymentsRes.data.results;
      const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.results;

      setPayments(paymentsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentModeFilter(e.target.value);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.order_customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_id.toString().includes(searchTerm) ||
      payment.order.toString().includes(searchTerm);
    
    const matchesFilter = !paymentModeFilter || payment.payment_mode === paymentModeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleOrderChange = (orderId: string) => {
    const selectedOrder = orders.find(order => order.order_id.toString() === orderId);
    setFormData(prev => ({
      ...prev,
      order: orderId,
      amount: selectedOrder ? selectedOrder.amount.toString() : '',
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.order) {
      newErrors.order = 'Please select an order';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.payment_mode) {
      newErrors.payment_mode = 'Please select a payment mode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      const submitData = {
        order: Number(formData.order),
        amount: Number(formData.amount),
        payment_mode: formData.payment_mode,
      };
      
      await paymentsAPI.create(submitData);
      await loadData();
      closeModal();
    } catch (error: any) {
      console.error('Error creating payment:', error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors: Record<string, string> = {};
        
        Object.keys(apiErrors).forEach(key => {
          if (Array.isArray(apiErrors[key])) {
            newErrors[key] = apiErrors[key][0];
          } else {
            newErrors[key] = apiErrors[key];
          }
        });
        
        setErrors(newErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = () => {
    setFormData({
      order: '',
      amount: '',
      payment_mode: 'cash',
    });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      order: '',
      amount: '',
      payment_mode: 'cash',
    });
    setErrors({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPaymentModeIcon = (mode: string) => {
    switch (mode) {
      case 'card':
        return '💳';
      case 'upi':
        return '📱';
      case 'bank_transfer':
        return '🏦';
      default:
        return '💵';
    }
  };

  const getPaymentModeColor = (mode: string) => {
    switch (mode) {
      case 'card':
        return 'bg-blue-100 text-blue-800';
      case 'upi':
        return 'bg-purple-100 text-purple-800';
      case 'bank_transfer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Manage payment transactions</p>
        </div>
        <button
          onClick={openModal}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Payment
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search payments by customer, payment ID, or order ID..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-input pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={paymentModeFilter}
            onChange={handleFilterChange}
            className="form-input"
          >
            <option value="">All Payment Modes</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    {searchTerm || paymentModeFilter ? 'No payments found matching your criteria.' : 'No payments found.'}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.payment_id}>
                    <td>
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-primary-600 mr-2" />
                        <span className="font-medium">#{payment.payment_id}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-gray-900">
                        Order #{payment.order}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {payment.order_customer_name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentModeColor(payment.payment_mode)}`}>
                        <span className="mr-1">{getPaymentModeIcon(payment.payment_mode)}</span>
                        {payment.payment_mode.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Add Payment"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="form-label">
              Order
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="order"
              value={formData.order}
              onChange={(e) => handleOrderChange(e.target.value)}
              className={`form-input ${errors.order ? 'border-red-500 focus:ring-red-500' : ''}`}
              required
            >
              <option value="">Select an order</option>
              {orders.map(order => (
                <option key={order.order_id} value={order.order_id}>
                  Order #{order.order_id} - {order.customer_name} ({formatCurrency(order.amount)})
                </option>
              ))}
            </select>
            {errors.order && (
              <div className="text-red-600 text-sm">{errors.order}</div>
            )}
          </div>

          <FormInput
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            required
            min={0}
            step={0.01}
            error={errors.amount}
          />

          <div className="space-y-1">
            <label className="form-label">
              Payment Mode
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="payment_mode"
              value={formData.payment_mode}
              onChange={handleInputChange}
              className={`form-input ${errors.payment_mode ? 'border-red-500 focus:ring-red-500' : ''}`}
              required
            >
              <option value="cash">💵 Cash</option>
              <option value="card">💳 Card</option>
              <option value="upi">📱 UPI</option>
              <option value="bank_transfer">🏦 Bank Transfer</option>
            </select>
            {errors.payment_mode && (
              <div className="text-red-600 text-sm">{errors.payment_mode}</div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Add Payment'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Payments;