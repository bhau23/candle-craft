import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Share2, 
  Gift, 
  Sparkles, 
  Package,
  Star,
  Crown,
  Diamond,
  Ribbon
} from "lucide-react";
import gift1_1 from "@/assets/products/gift1/1.png";
import gift1_2 from "@/assets/products/gift1/2.png";
import gift1_3 from "@/assets/products/gift1/3.png";
import gift1_4 from "@/assets/products/gift1/4.png";
import gift1_5 from "@/assets/products/gift1/5.jpeg";
import gift1_6 from "@/assets/products/gift1/6.png";

interface GiftProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  giftFeatures: string[];
}

const GiftProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGift, setIsGift] = useState(true);
  const [selectedRibbon, setSelectedRibbon] = useState('gold');
  const [giftMessage, setGiftMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Gift product data
  const giftProducts: Record<string, GiftProduct> = {
    'gift1': {
      id: 'gift1',
      name: "Premium Gift Set",
      price: 1299.00,
      originalPrice: 1599.00,
      description: "An exquisitely crafted candle gift set perfect for special occasions. This premium collection features multiple candles with distinctive fragrances, beautifully packaged for the perfect gift experience.",
      images: [gift1_1, gift1_2, gift1_3, gift1_4, gift1_5, gift1_6],
      features: [
        "Premium soy wax blend",
        "Hand-poured with love",
        "Long-lasting burn time 50+ hours total",
        "Elegant gift packaging",
        "Multiple signature scents",
        "Perfect for gifting"
      ],
      giftFeatures: [
        "Luxury gift box with magnetic closure",
        "Premium satin ribbon wrapping",
        "Personalized gift card included",
        "Express gift delivery available",
        "Gift receipt included"
      ],
      specifications: {
        "Total Burn Time": "50+ hours",
        "Wax Type": "Premium Soy Wax Blend",
        "Wick": "Cotton Wick",
        "Fragrance": "Signature Scent Collection",
        "Container": "Premium Glass Set",
        "Weight": "450 gm total",
        "Packaging": "Luxury Gift Box"
      }
    }
  };

  const product = giftProducts[id || 'gift1'];

  // Auto-rotate images for hero effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % product.images.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [product.images.length]);

  const handleAddToCart = () => {
    console.log('Added gift to cart:', { 
      product, 
      isGift, 
      selectedRibbon, 
      giftMessage, 
      recipientName
    });
  };

  const handleBuyNow = () => {
    console.log('Buy gift now:', { 
      product, 
      isGift, 
      selectedRibbon, 
      giftMessage, 
      recipientName
    });
  };

  if (!product) {
    return <div>Gift not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-50 via-white to-luxury-100">
      {/* Elegant Header with floating effect */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="group hover:bg-white/80 backdrop-blur-sm border border-luxury-200 shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Gifts
          </Button>
        </div>

        {/* Hero Section with Elegant Design */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-luxury-900 via-luxury-800 to-luxury-900 p-1 mb-12 shadow-2xl">
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/5 via-transparent to-luxury-gold/5 animate-pulse"></div>
          <div className="relative bg-white rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Enhanced Image Gallery */}
              <div className="relative bg-gradient-to-br from-luxury-50 to-white p-8 lg:p-12">
                {/* Floating decorative elements */}
                <div className="absolute top-4 right-4 text-luxury-300 animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="absolute bottom-4 left-4 text-luxury-300 animate-pulse delay-1000">
                  <Diamond className="w-5 h-5" />
                </div>
                <div className="absolute top-1/2 left-2 text-luxury-200/50 animate-bounce delay-500">
                  <Star className="w-4 h-4" />
                </div>
                <div className="absolute top-1/4 right-8 text-luxury-200/50 animate-bounce delay-700">
                  <Crown className="w-4 h-4" />
                </div>
                
                {/* Main Product Display */}
                <div className="relative">
                  {/* Main Image with elegant frame */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-luxury-lg border-4 border-luxury-100 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-luxury-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <img 
                      src={product.images[selectedImage]} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-luxury animate-fade-in"
                    />
                  </div>
                  
                  {/* Elegant Thumbnail Gallery */}
                  <div className="flex gap-3 mt-6 justify-center">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                          selectedImage === index 
                            ? 'border-luxury-gold shadow-luxury-md ring-2 ring-luxury-gold/30' 
                            : 'border-luxury-200 hover:border-luxury-300'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {selectedImage === index && (
                          <div className="absolute inset-0 bg-luxury-gold/20"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Product Information */}
              <div className="p-8 lg:p-12 bg-gradient-to-br from-white via-luxury-25 to-luxury-50">
                <div className="space-y-8">
                  {/* Product Title with Luxury Styling */}
                  <div className="border-b border-luxury-200 pb-6">
                    <h1 className="text-4xl lg:text-5xl font-light text-luxury-900 mb-4 tracking-wide bg-gradient-to-r from-luxury-900 via-luxury-800 to-luxury-900 bg-clip-text">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-4 mb-4 animate-fade-in">
                      <span className="text-3xl font-bold text-luxury-gold drop-shadow-sm">
                        Rs. {product.price.toFixed(2)}
                      </span>
                      <span className="text-xl text-muted-foreground line-through">
                        Rs. {product.originalPrice.toFixed(2)}
                      </span>
                      <Badge variant="secondary" className="text-green-600 px-3 py-1 animate-pulse">
                        Save Rs. {(product.originalPrice - product.price).toFixed(2)}
                      </Badge>
                    </div>
                  </div>

                  {/* Gift Customization Section */}
                  <div className="space-y-6 border-b border-luxury-200 pb-6">
                    <div className="flex items-center gap-2 text-luxury-700">
                      <Package className="w-5 h-5" />
                      <h3 className="font-semibold text-lg">Customize Your Gift</h3>
                    </div>
                    
                    {/* Ribbon Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-luxury-700">Choose Ribbon Color</Label>
                      <Select value={selectedRibbon} onValueChange={setSelectedRibbon}>
                        <SelectTrigger className="w-full border-luxury-200 focus:border-luxury-gold">
                          <SelectValue placeholder="Select ribbon color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gold">✨ Luxury Gold</SelectItem>
                          <SelectItem value="silver">🤍 Elegant Silver</SelectItem>
                          <SelectItem value="burgundy">❤️ Classic Burgundy</SelectItem>
                          <SelectItem value="navy">💙 Royal Navy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Recipient Name */}
                    <div className="space-y-3">
                      <Label htmlFor="recipient" className="text-sm font-medium text-luxury-700">Recipient Name (Optional)</Label>
                      <Input
                        id="recipient"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Enter recipient's name"
                        className="border-luxury-200 focus:border-luxury-gold"
                      />
                    </div>

                    {/* Gift Message */}
                    <div className="space-y-3">
                      <Label htmlFor="message" className="text-sm font-medium text-luxury-700">Personal Message (Optional)</Label>
                      <Textarea
                        id="message"
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Write a heartfelt message..."
                        className="min-h-20 border-luxury-200 focus:border-luxury-gold resize-none"
                        maxLength={200}
                      />
                      <p className="text-xs text-luxury-500">{giftMessage.length}/200 characters</p>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="space-y-4">
                    <Button 
                      onClick={handleAddToCart}
                      variant="outline" 
                      className="w-full py-6 text-lg font-semibold border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-300 group"
                    >
                      <Package className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      ADD TO CART
                    </Button>
                    <Button 
                      onClick={handleBuyNow}
                      className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-luxury-gold to-luxury-600 hover:from-luxury-600 hover:to-luxury-700 text-white shadow-luxury-md hover:shadow-luxury-lg transition-all duration-300 group"
                    >
                      <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      BUY AS GIFT NOW
                    </Button>
                  </div>

                  {/* Action Icons */}
                  <div className="flex justify-center gap-8 pt-4">
                    <Button variant="ghost" size="sm" className="group text-luxury-600 hover:text-luxury-gold">
                      <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Product Details with Gift Features */}
        <div className="bg-white rounded-2xl shadow-luxury-lg border border-luxury-100 p-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-2/3 bg-luxury-50 rounded-xl p-1">
              <TabsTrigger value="description" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Description</TabsTrigger>
              <TabsTrigger value="gift-features" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Gift Features</TabsTrigger>
              <TabsTrigger value="behind-scenes" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Craftsmanship</TabsTrigger>
              <TabsTrigger value="specifications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Specifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <Card className="border-luxury-100 shadow-md">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Gift className="w-6 h-6 text-luxury-gold" />
                    <h3 className="text-xl font-semibold text-luxury-900">Product Description</h3>
                  </div>
                  <p className="text-luxury-700 leading-relaxed mb-8 text-lg">
                    {product.description}
                  </p>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-luxury-900 text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-luxury-gold" />
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-luxury-50 rounded-lg border border-luxury-100">
                          <div className="w-2 h-2 bg-luxury-gold rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-luxury-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="gift-features" className="mt-8">
              <Card className="border-luxury-100 shadow-md">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Ribbon className="w-6 h-6 text-luxury-gold" />
                    <h3 className="text-xl font-semibold text-luxury-900">Exclusive Gift Features</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.giftFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-4 p-6 bg-gradient-to-r from-luxury-50 to-luxury-100 rounded-xl border border-luxury-200">
                        <div className="w-3 h-3 bg-gradient-to-r from-luxury-gold to-luxury-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-luxury-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-luxury-gold/10 to-luxury-600/10 rounded-xl border border-luxury-200">
                    <h4 className="font-semibold text-luxury-900 mb-3 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-luxury-gold" />
                      Premium Gift Experience
                    </h4>
                    <p className="text-luxury-700 leading-relaxed">
                      Every gift is meticulously prepared by our luxury packaging team, ensuring an unforgettable unboxing experience. 
                      From the moment your recipient receives the package to the last candle burning, every detail is crafted to create lasting memories.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="behind-scenes" className="mt-8">
              <Card className="border-luxury-100 shadow-md">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Diamond className="w-6 h-6 text-luxury-gold" />
                    <h3 className="text-xl font-semibold text-luxury-900">Artisan Craftsmanship</h3>
                  </div>
                  <div className="space-y-6">
                    <p className="text-luxury-700 leading-relaxed text-lg">
                      Each Premium Gift Set is carefully curated and hand-assembled by our skilled artisans. Every candle is 
                      individually hand-poured using premium soy wax and the finest essential oil blends, ensuring consistent 
                      quality and an exceptional fragrance experience.
                    </p>
                    <p className="text-luxury-700 leading-relaxed">
                      Our sustainable approach combines traditional craftsmanship with modern luxury. The elegant packaging 
                      is made from responsibly sourced materials, and every glass container can be beautifully repurposed 
                      after the candles have finished burning.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      <div className="text-center p-6 bg-luxury-50 rounded-xl border border-luxury-100">
                        <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <h5 className="font-semibold text-luxury-900 mb-2">Hand-Assembled</h5>
                        <p className="text-sm text-luxury-600">Carefully curated by expert hands</p>
                      </div>
                      <div className="text-center p-6 bg-luxury-50 rounded-xl border border-luxury-100">
                        <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h5 className="font-semibold text-luxury-900 mb-2">Premium Quality</h5>
                        <p className="text-sm text-luxury-600">Only the finest materials used</p>
                      </div>
                      <div className="text-center p-6 bg-luxury-50 rounded-xl border border-luxury-100">
                        <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <h5 className="font-semibold text-luxury-900 mb-2">Luxury Experience</h5>
                        <p className="text-sm text-luxury-600">Unforgettable unboxing moments</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-8">
              <Card className="border-luxury-100 shadow-md">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-6 h-6 text-luxury-gold" />
                    <h3 className="text-xl font-semibold text-luxury-900">Product Specifications</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-4 bg-luxury-50 rounded-lg border border-luxury-100">
                        <span className="font-medium text-luxury-900">{key}:</span>
                        <span className="text-luxury-700 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default GiftProductDetail;