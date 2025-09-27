import React, { useState, useEffect } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { Plus, Eye } from 'lucide-react'

interface Order {
  order_id: number
  customer: number
  customer_name: string
  order_date: string
  amount: number
  items: any[]
}

interface Customer {
  customer_id: number
  name: string
}

interface Product {
  product_id: number
  name: string
  price: number
  stock: number
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [formData, setFormData] = useState({
    customer: '',
    items: [{ product: '', quantity: 1 }]
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        api.get('/orders/'),
        api.get('/customers/'),
        api.get('/products/')
      ])
      
      setOrders(ordersRes.data.results || ordersRes.data)
      setCustomers(customersRes.data.results || customersRes.data)
      setProducts(productsRes.data.results || productsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const totalAmount = formData.items.reduce((sum, item) => {
        const product = products.find(p => p.product_id === parseInt(item.product))
        return sum + (product ? product.price * item.quantity : 0)
      }, 0)

      const orderData = {
        customer: parseInt(formData.customer),
        amount: totalAmount,
        items: formData.items.map(item => ({
          product: parseInt(item.product),
          quantity: item.quantity
        }))
      }

      await api.post('/orders/', orderData)
      fetchData()
      resetForm()
    } catch (error) {
      console.error('Failed to create order:', error)
    }
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: 1 }]
    })
  }

  const handleRemoveItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData({ ...formData, items: newItems })
    }
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const resetForm = () => {
    setFormData({
      customer: '',
      items: [{ product: '', quantity: 1 }]
    })
    setShowModal(false)
  }

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Order
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.order_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${parseFloat(order.amount.toString()).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create Order</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Customer
                </label>
                <select
                  required
                  className="input-field"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.customer_id} value={customer.customer_id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Items
                </label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <select
                      required
                      className="input-field flex-1"
                      value={item.product}
                      onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.product_id} value={product.product_id}>
                          {product.name} - ${product.price}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      required
                      className="input-field w-20"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="btn btn-error"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="btn btn-secondary mt-2"
                >
                  Add Item
                </button>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Order #{selectedOrder.order_id}
            </h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Customer:</span> {selectedOrder.customer_name}
              </div>
              <div>
                <span className="font-medium">Date:</span> {new Date(selectedOrder.order_date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Items:</span>
                <ul className="mt-1">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {item.product_name} x {item.quantity} - ${(item.product_price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t pt-3">
                <span className="font-medium">Total:</span> ${parseFloat(selectedOrder.amount.toString()).toFixed(2)}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders