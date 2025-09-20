import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Trash2, 
  Eye, 
  ShoppingBag,
  Gift
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getCartSummary } = useCart();
  const navigate = useNavigate();
  const summary = getCartSummary();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          {/* Empty Cart */}
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Discover our beautiful candle collection</p>
            <Button onClick={() => navigate('/')} className="bg-amber-600 hover:bg-amber-700">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <Badge variant="secondary" className="ml-auto">
            {summary.totalItems} {summary.totalItems === 1 ? 'item' : 'items'}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {item.product.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Badges */}
                      <div className="flex gap-2 mb-3">
                        {item.isGift && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            <Gift className="h-3 w-3 mr-1" />
                            Gift Item (+₹{30})
                          </Badge>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{item.product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.product.originalPrice.toFixed(2)}
                        </span>
                        <Badge variant="secondary" className="text-green-600">
                          Save ₹{(item.product.originalPrice - item.product.price).toFixed(2)}
                        </Badge>
                      </div>

                      {/* Quantity Controls and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* View Details Dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>{item.product.name} - Price Breakdown</DialogTitle>
                              <DialogDescription>
                                Detailed pricing information for this item
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span>Original Price:</span>
                                <span>₹{item.product.originalPrice.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-green-600">
                                <span>Discount:</span>
                                <span>-₹{(item.product.originalPrice - item.product.price).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Discounted Price:</span>
                                <span>₹{item.product.price.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Quantity:</span>
                                <span>{item.quantity}</span>
                              </div>
                              {item.isGift && (
                                <div className="flex justify-between">
                                  <span>Gift Charge:</span>
                                  <span>₹{(30 * item.quantity).toFixed(2)}</span>
                                </div>
                              )}
                              <Separator />
                              <div className="flex justify-between font-semibold">
                                <span>Item Total:</span>
                                <span>
                                  ₹{((item.product.price * item.quantity) + (item.isGift ? 30 * item.quantity : 0)).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({summary.totalItems} items):</span>
                    <span>₹{summary.subtotal.toFixed(2)}</span>
                  </div>
                  {summary.totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Total Savings:</span>
                      <span>-₹{summary.totalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {summary.giftCharges > 0 && (
                    <div className="flex justify-between">
                      <span>Gift Charges:</span>
                      <span>₹{summary.giftCharges.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span>₹{summary.platformFee.toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>₹{summary.total.toFixed(2)}</span>
                </div>

                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;