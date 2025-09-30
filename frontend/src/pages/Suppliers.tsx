import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Truck, Package, Link, Unlink } from 'lucide-react';
import { suppliersAPI, productsAPI, productSuppliersAPI } from '../services/api';
import { Supplier, Product, ProductSupplier } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import ConfirmDialog from '../components/ConfirmDialog';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSuppliers, setProductSuppliers] = useState<ProductSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteSupplier, setDeleteSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
  });
  const [linkData, setLinkData] = useState({
    product: '',
    supplier: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [suppliersRes, productsRes, productSuppliersRes] = await Promise.all([
        suppliersAPI.getAll(),
        productsAPI.getAll(),
        productSuppliersAPI.getAll(),
      ]);

      const suppliersData = Array.isArray(suppliersRes.data) ? suppliersRes.data : suppliersRes.data.results;
      const productsData = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data.results;
      const productSuppliersData = Array.isArray(productSuppliersRes.data) ? productSuppliersRes.data : productSuppliersRes.data.results;

      setSuppliers(suppliersData);
      setProducts(productsData);
      setProductSuppliers(productSuppliersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleLinkInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLinkData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Supplier name is required';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact information is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLinkForm = () => {
    const newErrors: Record<string, string> = {};

    if (!linkData.product) {
      newErrors.product = 'Please select a product';
    }

    if (!linkData.supplier) {
      newErrors.supplier = 'Please select a supplier';
    }

    // Check if link already exists
    const existingLink = productSuppliers.find(
      link => link.product.toString() === linkData.product && link.supplier.toString() === linkData.supplier
    );

    if (existingLink) {
      newErrors.product = 'This product is already linked to this supplier';
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
      
      if (editingSupplier) {
        await suppliersAPI.update(editingSupplier.supplier_id, formData);
      } else {
        await suppliersAPI.create(formData);
      }
      
      await loadData();
      closeModal();
    } catch (error: any) {
      console.error('Error saving supplier:', error);
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

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLinkForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      await productSuppliersAPI.create({
        product: Number(linkData.product),
        supplier: Number(linkData.supplier),
      });
      
      await loadData();
      closeLinkModal();
    } catch (error: any) {
      console.error('Error linking product to supplier:', error);
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

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setDeleteSupplier(supplier);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteSupplier) return;

    try {
      await suppliersAPI.delete(deleteSupplier.supplier_id);
      await loadData();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const openModal = () => {
    setEditingSupplier(null);
    setFormData({ name: '', contact: '' });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
    setFormData({ name: '', contact: '' });
    setErrors({});
  };

  const openLinkModal = () => {
    setLinkData({ product: '', supplier: '' });
    setErrors({});
    setShowLinkModal(true);
  };

  const closeLinkModal = () => {
    setShowLinkModal(false);
    setLinkData({ product: '', supplier: '' });
    setErrors({});
  };

  const getSupplierProductCount = (supplierId: number) => {
    return productSuppliers.filter(link => link.supplier === supplierId).length;
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
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your suppliers and product relationships</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={openLinkModal}
            className="btn btn-secondary"
          >
            <Link className="w-4 h-4 mr-2" />
            Link Product
          </button>
          <button
            onClick={openModal}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search suppliers by name or contact..."
          value={searchTerm}
          onChange={handleSearch}
          className="form-input pl-10"
        />
      </div>

      {/* Suppliers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No suppliers found matching your search.' : 'No suppliers found.'}
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.supplier_id}>
                    <td>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <Truck className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {supplier.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: #{supplier.supplier_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-900">
                        {supplier.contact}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {getSupplierProductCount(supplier.supplier_id)} product{getSupplierProductCount(supplier.supplier_id) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit supplier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete supplier"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product-Supplier Links */}
      {productSuppliers.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product-Supplier Relationships</h3>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Supplier</th>
                  <th>Linked Date</th>
                </tr>
              </thead>
              <tbody>
                {productSuppliers.map((link, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {link.product_name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {link.supplier_name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-gray-500">
                        {new Date(link.created_at).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Supplier Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Supplier Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter supplier name"
            required
            error={errors.name}
          />

          <FormInput
            label="Contact Information"
            name="contact"
            type="text"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="Enter contact details (email, phone, etc.)"
            required
            error={errors.contact}
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
                editingSupplier ? 'Update Supplier' : 'Add Supplier'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Link Product to Supplier Modal */}
      <Modal
        isOpen={showLinkModal}
        onClose={closeLinkModal}
        title="Link Product to Supplier"
        size="md"
      >
        <form onSubmit={handleLinkSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="form-label">
              Product
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="product"
              value={linkData.product}
              onChange={handleLinkInputChange}
              className={`form-input ${errors.product ? 'border-red-500 focus:ring-red-500' : ''}`}
              required
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product.product_id} value={product.product_id}>
                  {product.name}
                </option>
              ))}
            </select>
            {errors.product && (
              <div className="text-red-600 text-sm">{errors.product}</div>
            )}
          </div>

          <div className="space-y-1">
            <label className="form-label">
              Supplier
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="supplier"
              value={linkData.supplier}
              onChange={handleLinkInputChange}
              className={`form-input ${errors.supplier ? 'border-red-500 focus:ring-red-500' : ''}`}
              required
            >
              <option value="">Select a supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.supplier_id} value={supplier.supplier_id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {errors.supplier && (
              <div className="text-red-600 text-sm">{errors.supplier}</div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeLinkModal}
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
                'Link Product'
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
        title="Delete Supplier"
        message={`Are you sure you want to delete ${deleteSupplier?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Suppliers;