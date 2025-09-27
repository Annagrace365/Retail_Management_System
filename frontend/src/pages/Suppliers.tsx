import React, { useState, useEffect } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { Plus, CreditCard as Edit, Trash2, Link } from 'lucide-react'

interface Supplier {
  supplier_id: number
  name: string
  contact: string
}

interface Product {
  product_id: number
  name: string
}

interface ProductSupplier {
  product: number
  product_name: string
  supplier: number
  supplier_name: string
}

function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productSuppliers, setProductSuppliers] = useState<ProductSupplier[]>([])
  const [loading, setLoading] = useState(true)
  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [supplierFormData, setSupplierFormData] = useState({
    name: '',
    contact: ''
  })
  const [linkFormData, setLinkFormData] = useState({
    product: '',
    supplier: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [suppliersRes, productsRes, productSuppliersRes] = await Promise.all([
        api.get('/suppliers/'),
        api.get('/products/'),
        api.get('/product-suppliers/')
      ])
      
      setSuppliers(suppliersRes.data.results || suppliersRes.data)
      setProducts(productsRes.data.results || productsRes.data)
      setProductSuppliers(productSuppliersRes.data.results || productSuppliersRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.supplier_id}/`, supplierFormData)
      } else {
        await api.post('/suppliers/', supplierFormData)
      }
      
      fetchData()
      resetSupplierForm()
    } catch (error) {
      console.error('Failed to save supplier:', error)
    }
  }

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await api.post('/product-suppliers/', {
        product: parseInt(linkFormData.product),
        supplier: parseInt(linkFormData.supplier)
      })
      
      fetchData()
      resetLinkForm()
    } catch (error) {
      console.error('Failed to link product and supplier:', error)
    }
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setSupplierFormData({
      name: supplier.name,
      contact: supplier.contact
    })
    setShowSupplierModal(true)
  }

  const handleDeleteSupplier = async (supplierId: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await api.delete(`/suppliers/${supplierId}/`)
        fetchData()
      } catch (error) {
        console.error('Failed to delete supplier:', error)
      }
    }
  }

  const resetSupplierForm = () => {
    setSupplierFormData({ name: '', contact: '' })
    setEditingSupplier(null)
    setShowSupplierModal(false)
  }

  const resetLinkForm = () => {
    setLinkFormData({ product: '', supplier: '' })
    setShowLinkModal(false)
  }

  if (loading) {
    return <LoadingSpinner size="lg" />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
        <div className="space-x-3">
          <button
            onClick={() => setShowLinkModal(true)}
            className="btn btn-secondary flex items-center"
          >
            <Link className="h-5 w-5 mr-2" />
            Link Product
          </button>
          <button
            onClick={() => setShowSupplierModal(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Suppliers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.supplier_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {supplier.supplier_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supplier.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditSupplier(supplier)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSupplier(supplier.supplier_id)}
                      className="text-error-600 hover:text-error-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product-Supplier Relationships */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Product-Supplier Relationships</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productSuppliers.map((ps, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ps.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ps.supplier_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
            </h3>
            <form onSubmit={handleSupplierSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={supplierFormData.name}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Contact
                </label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  value={supplierFormData.contact}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, contact: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetSupplierForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSupplier ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Product-Supplier Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Link Product to Supplier</h3>
            <form onSubmit={handleLinkSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Product
                </label>
                <select
                  required
                  className="input-field"
                  value={linkFormData.product}
                  onChange={(e) => setLinkFormData({ ...linkFormData, product: e.target.value })}
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Supplier
                </label>
                <select
                  required
                  className="input-field"
                  value={linkFormData.supplier}
                  onChange={(e) => setLinkFormData({ ...linkFormData, supplier: e.target.value })}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.supplier_id} value={supplier.supplier_id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetLinkForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Suppliers