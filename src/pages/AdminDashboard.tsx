import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Calendar,
  Edit,
  Trash2,
  Plus,
  LogOut,
  ArrowLeft,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const { orders, products, stats, loading, updateOrderStatus, addProduct, updateProduct, deleteProduct } = useAdmin();
  const navigate = useNavigate();

  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    category: '',
    images: [] as string[],
    inStock: true
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  // Check admin access
  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await addProduct(newProduct);
      setNewProduct({
        name: '',
        price: 0,
        description: '',
        category: '',
        images: [],
        inStock: true
      });
      setNewImageUrl('');
      setShowAddProductForm(false);
      alert('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct.id, {
        name: editingProduct.name,
        price: editingProduct.price,
        description: editingProduct.description,
        category: editingProduct.category,
        images: editingProduct.images,
        inStock: editingProduct.inStock
      });
      setEditingProduct(null);
      alert('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(productId);
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const addImageToProduct = (imageUrl: string, isNew: boolean = true) => {
    if (!imageUrl.trim()) return;

    if (isNew) {
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
    } else if (editingProduct) {
      setEditingProduct(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }));
    }
    setNewImageUrl('');
  };

  const removeImageFromProduct = (index: number, isNew: boolean = true) => {
    if (isNew) {
      setNewProduct(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else if (editingProduct) {
      setEditingProduct(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_payment': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Store</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {userProfile.fullName}!</p>
            </div>
          </div>
          <Button onClick={logout} variant="outline" className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Orders ({orders.length})</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Products ({products.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">All time orders</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">From completed orders</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeUsers}</div>
                    <p className="text-xs text-muted-foreground">Customers who placed orders</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{products.length}</div>
                    <p className="text-xs text-muted-foreground">Active products</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Sales & Top Products */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentSales.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Order #{order.id.slice(-6)}</p>
                            <p className="text-sm text-gray-600">
                              {order.createdAt.toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{order.orderTotal.toFixed(2)}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.topProducts.slice(0, 5).map((product, index) => (
                        <div key={product.productId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-lg text-gray-400">#{index + 1}</span>
                            <div>
                              <p className="font-medium">{product.productName}</p>
                              <p className="text-sm text-gray-600">{product.totalSold} sold</p>
                            </div>
                          </div>
                          <p className="font-bold">₹{product.revenue.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order Management</h2>
              </div>
              
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                          <p className="text-sm text-gray-600">
                            Customer: {order.deliveryAddress.fullName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total: ₹{order.orderTotal.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Date: {order.createdAt.toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        
                        <div className="space-y-2 text-right">
                          <Select 
                            defaultValue={order.status}
                            onValueChange={(value) => handleStatusUpdate(order.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending_payment">Pending Payment</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>{selectedOrder === order.id ? 'Hide' : 'View'} Details</span>
                          </Button>
                        </div>
                      </div>
                      
                      {selectedOrder === order.id && (
                        <>
                          <Separator className="my-4" />
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Order Items:</h4>
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                  <span>{item.productName} x {item.quantity}</span>
                                  <span>₹{item.total.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Delivery Address:</h4>
                              <p className="text-sm text-gray-600">
                                {order.deliveryAddress.fullName}<br />
                                {order.deliveryAddress.phoneNumber}<br />
                                {order.deliveryAddress.addressLine1}<br />
                                {order.deliveryAddress.addressLine2 && `${order.deliveryAddress.addressLine2}\n`}
                                {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Product Management</h2>
                <Button 
                  onClick={() => setShowAddProductForm(!showAddProductForm)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Product</span>
                </Button>
              </div>

              {/* Add Product Form */}
              {showAddProductForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Product</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                      />
                      <Input
                        placeholder="Category"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      />
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">In Stock:</label>
                        <input
                          type="checkbox"
                          checked={newProduct.inStock}
                          onChange={(e) => setNewProduct({...newProduct, inStock: e.target.checked})}
                        />
                      </div>
                    </div>
                    
                    <Textarea
                      placeholder="Product Description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    />
                    
                    {/* Image Management */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Product Images:</label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          placeholder="Image URL"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={() => addImageToProduct(newImageUrl, true)}
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                      {newProduct.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {newProduct.images.map((img, index) => (
                            <div key={index} className="relative">
                              <img src={img} alt={`Product ${index + 1}`} className="w-full h-20 object-cover rounded" />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeImageFromProduct(index, true)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleAddProduct}>Add Product</Button>
                      <Button variant="outline" onClick={() => setShowAddProductForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Edit Product Form */}
              {editingProduct && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Product</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Product Name"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                      />
                      <Input
                        placeholder="Category"
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                      />
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">In Stock:</label>
                        <input
                          type="checkbox"
                          checked={editingProduct.inStock}
                          onChange={(e) => setEditingProduct({...editingProduct, inStock: e.target.checked})}
                        />
                      </div>
                    </div>
                    
                    <Textarea
                      placeholder="Product Description"
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    />
                    
                    {/* Image Management for Edit */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Product Images:</label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          placeholder="Image URL"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={() => addImageToProduct(newImageUrl, false)}
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                      {editingProduct.images?.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {editingProduct.images.map((img, index) => (
                            <div key={index} className="relative">
                              <img src={img} alt={`Product ${index + 1}`} className="w-full h-20 object-cover rounded" />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeImageFromProduct(index, false)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProduct}>Update Product</Button>
                      <Button variant="outline" onClick={() => setEditingProduct(null)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Products List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        {product.images && product.images.length > 0 && (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-32 object-cover rounded"
                          />
                        )}
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-2xl font-bold">₹{product.price}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                        <Badge variant={product.inStock ? 'secondary' : 'destructive'}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                        
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                            className="flex items-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex items-center space-x-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {products.length === 0 && (
                  <Card className="col-span-full">
                    <CardContent className="pt-6 text-center">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No products added yet.</p>
                      <Button 
                        onClick={() => setShowAddProductForm(true)}
                        className="mt-4"
                      >
                        Add Your First Product
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};