import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { productsAPI } from '../services/api';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import ConfirmDialog from '../components/ConfirmDialog';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      const data = Array.isArray(response.data) ? response.data : response.data.results;
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_id.toString().includes(searchTerm)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Please enter a valid stock quantity';
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
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };
      
      if (editingProduct) {
        await productsAPI.update(editingProduct.product_id, submitData);
      } else {
        await productsAPI.create(submitData);
      }
      
      await loadProducts();
      closeModal();
    } catch (error: any) {
      console.error('Error saving product:', error);
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (product: Product) => {
    setDeleteProduct(product);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteProduct) return;

    try {
      await productsAPI.delete(deleteProduct.product_id);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: '' });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: '' });
    setErrors({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { status: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    } else if (stock < 10) {
      return { status: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
    } else {
      return { status: 'In Stock', color: 'text-green-600 bg-green-100' };
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
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={openModal}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products by name or ID..."
          value={searchTerm}
          onChange={handleSearch}
          className="form-input pl-10"
        />
      </div>

      {/* Low Stock Alert */}
      {products.some(p => p.stock < 10) && (
        <div className="card border-l-4 border-yellow-500 bg-yellow-50">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800">
                Low Stock Alert
              </h3>
              <p className="text-yellow-700">
                {products.filter(p => p.stock < 10).length} product{products.filter(p => p.stock < 10).length !== 1 ? 's' : ''} 
                {' '}have low stock levels.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Suppliers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No products found matching your search.' : 'No products found.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <tr key={product.product_id}>
                      <td>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <Package className="h-5 w-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: #{product.product_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(product.price)}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 mr-2">
                            {product.stock}
                          </span>
                          {product.stock < 10 && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.status}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm text-gray-900">
                          {product.suppliers?.length > 0 ? (
                            <span className="text-green-600">
                              {product.suppliers.length} supplier{product.suppliers.length !== 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-gray-500">No suppliers</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Edit product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Product Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
            error={errors.name}
          />

          <FormInput
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            required
            min={0}
            step={0.01}
            error={errors.price}
          />

          <FormInput
            label="Stock Quantity"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="0"
            required
            min={0}
            error={errors.stock}
          />

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
                editingProduct ? 'Update Product' : 'Add Product'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete ${deleteProduct?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Products;