import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useNavigate, useLocation } from 'react-router-dom';
import { Order } from '../types/auth';
import { 
  User, 
  MapPin, 
  Package, 
  Edit, 
  Plus, 
  Trash2, 
  LogOut,
  ArrowLeft,
  Clock,
  CheckCircle,
  Truck,
  XCircle
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, userProfile, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Get initial tab from location state or default to 'profile'
  const initialTab = location.state?.activeTab || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [profileData, setProfileData] = useState({
    fullName: userProfile?.fullName || '',
    phoneNumber: userProfile?.phoneNumber || '',
  });

  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Fetch user orders in real-time
  useEffect(() => {
    if (!currentUser) return;

    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          estimatedDeliveryDate: data.estimatedDeliveryDate?.toDate(),
        } as Order;
      });
      setOrders(ordersData);
    });

    return unsubscribe;
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(profileData);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      alert('Failed to logout');
    }
  };

  const addAddress = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    try {
      const addressWithId = {
        ...newAddress,
        id: Date.now().toString(),
        isDefault: userProfile.addresses.length === 0
      };

      const updatedAddresses = [...userProfile.addresses, addressWithId];
      await updateProfile({ addresses: updatedAddresses });
      
      setNewAddress({
        label: '',
        fullName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
      });
      setShowAddAddressForm(false);
      alert('Address added successfully!');
    } catch (error) {
      alert('Failed to add address');
    }
    setLoading(false);
  };

  const removeAddress = async (addressId: string) => {
    if (!userProfile || !confirm('Are you sure you want to remove this address?')) return;
    
    setLoading(true);
    try {
      const updatedAddresses = userProfile.addresses.filter(addr => addr.id !== addressId);
      await updateProfile({ addresses: updatedAddresses });
      alert('Address removed successfully!');
    } catch (error) {
      alert('Failed to remove address');
    }
    setLoading(false);
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

  if (!currentUser || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please login to view your profile.</p>
          <Button onClick={() => navigate('/auth')}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">Welcome back, {userProfile.fullName}!</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Orders ({orders.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Personal Information</CardTitle>
                  <Button 
                    onClick={() => setEditMode(!editMode)}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>{editMode ? 'Cancel' : 'Edit'}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input value={userProfile.email} disabled className="mt-1" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    disabled={!editMode}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <Input
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                    disabled={!editMode}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Account Type</label>
                  <div className="mt-1">
                    <Badge variant={userProfile.role === 'admin' ? 'destructive' : 'secondary'}>
                      {userProfile.role === 'admin' ? 'Administrator' : 'Customer'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Member Since</label>
                  <p className="mt-1 text-gray-600">
                    {userProfile.createdAt?.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {editMode && (
                  <Button onClick={handleUpdateProfile} disabled={loading} className="w-full">
                    {loading ? 'Updating...' : 'Save Changes'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Delivery Addresses</h3>
                <Button 
                  onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Address</span>
                </Button>
              </div>

              {showAddAddressForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Address Label (e.g., Home, Office)"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                      />
                      <Input
                        placeholder="Full Name"
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                      />
                      <Input
                        placeholder="Phone Number"
                        value={newAddress.phoneNumber}
                        onChange={(e) => setNewAddress({...newAddress, phoneNumber: e.target.value})}
                      />
                      <Input
                        placeholder="Address Line 1"
                        value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})}
                      />
                      <Input
                        placeholder="Address Line 2 (Optional)"
                        value={newAddress.addressLine2}
                        onChange={(e) => setNewAddress({...newAddress, addressLine2: e.target.value})}
                      />
                      <Input
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      />
                      <Input
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                      />
                      <Input
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addAddress} disabled={loading}>
                        {loading ? 'Adding...' : 'Save Address'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddAddressForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {userProfile?.addresses.map((address) => (
                  <Card key={address.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{address.label}</h4>
                            {address.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <div className="text-gray-600 space-y-1">
                            <p>{address.fullName}</p>
                            <p>{address.phoneNumber}</p>
                            <p>{address.addressLine1}</p>
                            {address.addressLine2 && <p>{address.addressLine2}</p>}
                            <p>{address.city}, {address.state} - {address.pincode}</p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeAddress(address.id)}
                          className="flex items-center space-x-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {userProfile?.addresses.length === 0 && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No addresses added yet.</p>
                      <Button 
                        onClick={() => setShowAddAddressForm(true)}
                        className="mt-4"
                      >
                        Add Your First Address
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order History</h3>
              
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No orders yet.</p>
                    <Button onClick={() => navigate('/')}>
                      Start Shopping
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold">Order #{order.id.slice(-6)}</h4>
                            <p className="text-sm text-gray-600">
                              Placed on {order.createdAt.toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status.replace('_', ' ')}</span>
                            </div>
                            <p className="text-lg font-bold mt-1">₹{order.orderTotal.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                {item.productImage ? (
                                  <img 
                                    src={item.productImage} 
                                    alt={item.productName}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <Package className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity} × ₹{item.price}
                                </p>
                              </div>
                              <p className="font-medium">₹{item.total.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="text-sm text-gray-600">
                          <p><strong>Delivery Address:</strong></p>
                          <p>{order.deliveryAddress.fullName}</p>
                          <p>{order.deliveryAddress.addressLine1}</p>
                          {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
                          <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                        </div>
                        
                        {order.estimatedDeliveryDate && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Estimated Delivery:</strong> {order.estimatedDeliveryDate.toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};