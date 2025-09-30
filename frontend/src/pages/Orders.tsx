import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, ShoppingCart, User, Package, DollarSign, Calendar } from 'lucide-react';
import { ordersAPI, customersAPI, productsAPI } from '../services/api';
import { Order, Customer, Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    customer: '',
    items: [{ product_id: '', quantity: 1 }],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        ordersAPI.getAll(),
        customersAPI.getAll(),
        productsAPI.getAll(),
      ]);

      const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.results;
      const customersData = Array.isArray(customersRes.data) ? customersRes.data : customersRes.data.results;
      const productsData = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data.results;

      setOrders(ordersData);
      setCustomers(customersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter(order =>
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.order_id.toString().includes(searchTerm)
  );

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

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product_id: '', quantity: 1 }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer) {
      newErrors.customer = 'Please select a customer';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'Please add at least one item';
    }

    formData.items.forEach((item, index) => {
      if (!item.product_id) {
        newErrors[`item_${index}_product`] = 'Please select a product';
      }
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Please enter a valid quantity';
      }
    });

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
        customer: Number(formData.customer),
        items: formData.items.map(item => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
        })),
      };
      
      await ordersAPI.create(submitData);
      await loadData();
      closeModal();
    } catch (error: any) {
      console.error('Error creating order:', error);
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

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const openModal = () => {
    setFormData({
      customer: '',
      items: [{ product_id: '', quantity: 1 }],
    });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      customer: '',
      items: [{ product_id: '', quantity: 1 }],
    });
    setErrors({});
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
        <button
          onClick={openModal}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Order
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search orders by customer name or order ID..."
          value={searchTerm}
          onChange={handleSearch}
          className="form-input pl-10"
        />
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No orders found matching your search.' : 'No orders found.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td>
                      <div className="flex items-center">
                        <ShoppingCart className="h-5 w-5 text-primary-600 mr-2" />
                        <span className="font-medium">#{order.order_id}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {order.customer_name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(order.order_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {formatCurrency(order.amount)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-900">
                        {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-primary-600 hover:text-primary-900"
                        title="View order details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Create Order"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="form-label">
              Customer
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleInputChange}
              className={`form-input ${errors.customer ? 'border-red-500 focus:ring-red-500' : ''}`}
              required
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer.customer_id} value={customer.customer_id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
            {errors.customer && (
              <div className="text-red-600 text-sm">{errors.customer}</div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">Order Items</h4>
              <button
                type="button"
                onClick={addItem}
                className="btn btn-secondary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="form-label">
                      Product
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={item.product_id}
                      onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                      className={`form-input ${errors[`item_${index}_product`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map(product => (
                        <option key={product.product_id} value={product.product_id}>
                          {product.name} - {formatCurrency(product.price)} (Stock: {product.stock})
                        </option>
                      ))}
                    </select>
                    {errors[`item_${index}_product`] && (
                      <div className="text-red-600 text-sm">{errors[`item_${index}_product`]}</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="form-label">
                      Quantity
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      className={`form-input ${errors[`item_${index}_quantity`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                      required
                    />
                    {errors[`item_${index}_quantity`] && (
                      <div className="text-red-600 text-sm">{errors[`item_${index}_quantity`]}</div>
                    )}
                  </div>
                </div>

                {formData.items.length > 1 && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="btn btn-danger"
                    >
                      Remove Item
                    </button>
                  </div>
                )}
              </div>
            ))}

            {errors.items && (
              <div className="text-red-600 text-sm">{errors.items}</div>
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
                'Create Order'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={closeOrderModal}
        title={`Order #${selectedOrder?.order_id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                <p className="text-sm text-gray-600">{selectedOrder.customer_name}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Order Date</h4>
                <p className="text-sm text-gray-600">
                  {new Date(selectedOrder.order_date).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.order_items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.product_price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(item.total_price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(selectedOrder.amount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;