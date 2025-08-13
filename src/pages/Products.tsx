import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import Alert from '../components/UI/Alert';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  DollarSign,
  Tag,
  Archive
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  createdBy: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
  createdAt: string;
  isActive: boolean;
}

const Products: React.FC = () => {
  const { hasPermission } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await apiService.getProducts();
      setProducts(response.products || []);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProduct) {
        const response = await apiService.updateProduct(editingProduct._id, formData);
        setProducts(products.map(p => 
          p._id === editingProduct._id ? response.product : p
        ));
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        const response = await apiService.createProduct(formData);
        setProducts([response.product, ...products]);
        setMessage({ type: 'success', text: 'Product created successfully!' });
      }
      handleCloseModal();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await apiService.deleteProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
      setMessage({ type: 'success', text: 'Product deleted successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete product' });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      imageUrl: ''
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!hasPermission('product:read')) {
    return (
      <div className="page-body">
        <div className="container-xl">
          <div className="empty">
            <div className="empty-img">
              <Package size={48} />
            </div>
            <p className="empty-title">Access Denied</p>
            <p className="empty-subtitle text-muted">
              You don't have permission to view products.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">
                  <Package size={24} className="me-2" />
                  Product Management
                </h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                {hasPermission('product:create') && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                  >
                    <Plus size={16} className="me-2" />
                    Add Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {message.text && (
          <Alert 
            type={message.type as 'success' | 'error'} 
            onClose={() => setMessage({ type: '', text: '' })} 
            className="mb-3"
          >
            {message.text}
          </Alert>
        )}

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">All Products</h3>
            <div className="card-actions">
              <div className="input-icon">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="input-icon-addon">
                  <Search size={18} />
                </span>
              </div>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table card-table table-vcenter text-nowrap datatable">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Created By</th>
                  <th>Created</th>
                  <th className="w-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-sm me-3 bg-primary text-white">
                          <Package size={18} />
                        </span>
                        <div>
                          <div className="fw-bold">{product.name}</div>
                          <div className="text-muted small">
                            {product.description.length > 50 
                              ? `${product.description.substring(0, 50)}...`
                              : product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        <Tag size={12} className="me-1" />
                        {product.category}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <DollarSign size={16} className="me-1 text-success" />
                        {product.price.toFixed(2)}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td>
                      {product.createdBy.firstName && product.createdBy.lastName
                        ? `${product.createdBy.firstName} ${product.createdBy.lastName}`
                        : product.createdBy.username}
                    </td>
                    <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-list">
                        {hasPermission('product:update') && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(product)}
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {hasPermission('product:delete') && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(product._id)}
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Modal */}
        {showModal && (
          <div className="modal modal-blur show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                  </div>
                  
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Product Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Category</label>
                          <input
                            type="text"
                            className="form-control"
                            name="category"
                            value={formData.category}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleFormChange}
                        required
                      ></textarea>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="form-control"
                            name="price"
                            value={formData.price}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Stock Quantity</label>
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            name="stock"
                            value={formData.stock}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Image URL (Optional)</label>
                      <input
                        type="url"
                        className="form-control"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleFormChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;