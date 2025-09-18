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
import ImagePreview from "@/components/ImagePreview";
import gift1_1 from "@/assets/products/gift1/1.png";
import gift1_2 from "@/assets/products/gift1/2.png";
import gift1_3 from "@/assets/products/gift1/3.png";
import gift1_4 from "@/assets/products/gift1/4.png";
import gift1_5 from "@/assets/products/gift1/5.jpeg";
import gift1_6 from "@/assets/products/gift1/6.png";
import gift2_1 from "@/assets/products/gift2/1.png";
import gift2_2 from "@/assets/products/gift2/2.png";
import gift2_3 from "@/assets/products/gift2/3.jpg";
import gift2_4 from "@/assets/products/gift2/4.png";
import gift2_5 from "@/assets/products/gift2/5.png";
import gift2_6 from "@/assets/products/gift2/6.png";

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    },
    'gift2': {
      id: 'gift2',
      name: "Luxury Heritage Collection",
      price: 1799.00,
      originalPrice: 2199.00,
      description: "A sophisticated collection of artisanal candles with timeless elegance. Each piece is carefully crafted using traditional techniques, featuring premium materials and distinctive heritage-inspired fragrances.",
      images: [gift2_1, gift2_2, gift2_3, gift2_4, gift2_5, gift2_6],
      features: [
        "Premium beeswax blend",
        "Artisan hand-crafted",
        "60+ hours burn time",
        "Heritage wooden packaging",
        "Signature fragrance collection",
        "Limited edition design"
      ],
      giftFeatures: [
        "Handcrafted wooden gift box",
        "Premium gold ribbon wrapping",
        "Personalized brass nameplate",
        "White-glove delivery service",
        "Certificate of authenticity"
      ],
      specifications: {
        "Total Burn Time": "60+ hours",
        "Wax Type": "Premium Beeswax Blend",
        "Wick": "Wooden Wick",
        "Fragrance": "Heritage Scent Collection",
        "Container": "Artisan Glass Collection",
        "Weight": "650 gm total",
        "Packaging": "Heritage Wooden Box"
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
      {/* Mobile-Optimized Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-luxury-200">
        <div className="container mx-auto px-4 py-3">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="group hover:bg-luxury-50 transition-all duration-300 p-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Back to Gifts</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-6">
        {/* Desktop Layout: Two Column, Mobile: Single Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-luxury-100 p-4 md:p-6">
            {/* Main Product Image - Smaller on Desktop */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto rounded-xl overflow-hidden bg-luxury-50 mb-4 group">
                {/* Floating decorative elements - smaller for mobile */}
                <div className="absolute top-2 right-2 text-luxury-300 animate-pulse z-10">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="absolute bottom-2 left-2 text-luxury-300 animate-pulse delay-1000 z-10">
                  <Diamond className="w-3 h-3" />
                </div>
                
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setIsPreviewOpen(true)}
                />
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-6 gap-2 max-w-md mx-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-luxury-gold ring-2 ring-luxury-gold/30' 
                        : 'border-luxury-200 hover:border-luxury-300'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Information Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-luxury-100 p-4 md:p-6 space-y-6">
            {/* Product Title and Price */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-luxury-900 tracking-wide leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-2xl md:text-3xl font-bold text-luxury-gold">
                  Rs. {product.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-muted-foreground line-through">
                    Rs. {product.originalPrice.toFixed(2)}
                  </span>
                  <Badge variant="secondary" className="text-green-600 px-2 py-1 text-xs">
                    Save Rs. {(product.originalPrice - product.price).toFixed(2)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Gift Customization */}
            <div className="space-y-6 border-t border-luxury-200 pt-6">
              <div className="flex items-center gap-2 text-luxury-700">
                <Package className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Customize Your Gift</h3>
              </div>
              
              {/* Form Controls */}
              <div className="space-y-4">
                {/* Ribbon Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-luxury-700">Ribbon Color</Label>
                  <Select value={selectedRibbon} onValueChange={setSelectedRibbon}>
                    <SelectTrigger className="w-full h-12 border-luxury-200 focus:border-luxury-gold text-base">
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
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-sm font-medium text-luxury-700">Recipient Name (Optional)</Label>
                  <Input
                    id="recipient"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient's name"
                    className="h-12 border-luxury-200 focus:border-luxury-gold text-base"
                  />
                </div>

                {/* Gift Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-luxury-700">Personal Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Write a heartfelt message..."
                    className="min-h-24 border-luxury-200 focus:border-luxury-gold resize-none text-base"
                    maxLength={200}
                  />
                  <p className="text-xs text-luxury-500 text-right">{giftMessage.length}/200</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 border-t border-luxury-200 pt-6">
              <Button 
                onClick={handleAddToCart}
                variant="outline" 
                size="lg"
                className="w-full h-14 text-base font-semibold border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-300"
              >
                <Package className="w-5 h-5 mr-2" />
                ADD TO CART
              </Button>
              <Button 
                onClick={handleBuyNow}
                size="lg"
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-luxury-gold to-luxury-600 hover:from-luxury-600 hover:to-luxury-700 text-white shadow-lg transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                BUY AS GIFT NOW
              </Button>
              
              {/* Share Button */}
              <div className="flex justify-center pt-2">
                <Button variant="ghost" size="sm" className="text-luxury-600 hover:text-luxury-gold">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share This Gift
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Product Details */}
        <div className="bg-white rounded-2xl shadow-lg border border-luxury-100 overflow-hidden">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-luxury-50 rounded-none h-auto p-1 gap-1">
              <TabsTrigger value="description" className="text-xs sm:text-sm data-[state=active]:bg-white px-2 py-3 rounded">Description</TabsTrigger>
              <TabsTrigger value="gift-features" className="text-xs sm:text-sm data-[state=active]:bg-white px-2 py-3 rounded">Gift Features</TabsTrigger>
              <TabsTrigger value="behind-scenes" className="text-xs sm:text-sm data-[state=active]:bg-white px-2 py-3 rounded">Craftsmanship</TabsTrigger>
              <TabsTrigger value="specifications" className="text-xs sm:text-sm data-[state=active]:bg-white px-2 py-3 rounded">Specifications</TabsTrigger>
            </TabsList>
            
            {/* Mobile tabs content with proper spacing */}
            <div className="p-4 md:p-6">
              <TabsContent value="description" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-luxury-gold" />
                    <h3 className="text-lg font-semibold text-luxury-900">Product Description</h3>
                  </div>
                  <p className="text-luxury-700 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-luxury-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-luxury-gold" />
                      Key Features
                    </h4>
                    <div className="space-y-2">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-luxury-50 rounded-lg">
                          <div className="w-2 h-2 bg-luxury-gold rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-luxury-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="gift-features" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Ribbon className="w-5 h-5 text-luxury-gold" />
                    <h3 className="text-lg font-semibold text-luxury-900">Exclusive Gift Features</h3>
                  </div>
                  <div className="space-y-3">
                    {product.giftFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-luxury-50 to-luxury-100 rounded-lg">
                        <div className="w-2 h-2 bg-gradient-to-r from-luxury-gold to-luxury-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-luxury-700 font-medium text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="behind-scenes" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Diamond className="w-5 h-5 text-luxury-gold" />
                    <h3 className="text-lg font-semibold text-luxury-900">Artisan Craftsmanship</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-luxury-700 leading-relaxed text-sm">
                      Each Premium Gift Set is carefully curated and hand-assembled by our skilled artisans. Every candle is 
                      individually hand-poured using premium soy wax and the finest essential oil blends.
                    </p>
                    <p className="text-luxury-700 leading-relaxed text-sm">
                      Our sustainable approach combines traditional craftsmanship with modern luxury. The elegant packaging 
                      is made from responsibly sourced materials.
                    </p>
                    
                    {/* Mobile-optimized feature highlights */}
                    <div className="space-y-3 mt-6">
                      <div className="flex items-start gap-3 p-3 bg-luxury-50 rounded-lg">
                        <Package className="w-5 h-5 text-luxury-gold mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-luxury-900 text-sm">Hand-Assembled</h5>
                          <p className="text-xs text-luxury-600">Carefully curated by expert hands</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-luxury-50 rounded-lg">
                        <Sparkles className="w-5 h-5 text-luxury-gold mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-luxury-900 text-sm">Premium Quality</h5>
                          <p className="text-xs text-luxury-600">Only the finest materials used</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-luxury-50 rounded-lg">
                        <Crown className="w-5 h-5 text-luxury-gold mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-semibold text-luxury-900 text-sm">Luxury Experience</h5>
                          <p className="text-xs text-luxury-600">Unforgettable unboxing moments</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-luxury-gold" />
                    <h3 className="text-lg font-semibold text-luxury-900">Product Specifications</h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-luxury-50 rounded-lg">
                        <span className="font-medium text-luxury-900 text-sm">{key}:</span>
                        <span className="text-luxury-700 font-semibold text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        image={product.images[selectedImage]}
        alt={`${product.name} - View ${selectedImage + 1}`}
      />
    </div>
  );
};

export default GiftProductDetail;