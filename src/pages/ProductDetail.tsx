import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import product1_1 from "@/assets/products/product1/1.png";
import product1_2 from "@/assets/products/product1/2.png";
import product1_3 from "@/assets/products/product1/3.png";
import product1_4 from "@/assets/products/product1/4.png";
import product2_1 from "@/assets/products/product2/1.png";
import product2_2 from "@/assets/products/product2/2.png";
import product2_3 from "@/assets/products/product2/3.png";
import product2_4 from "@/assets/products/product2/4.png";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  sizes: string[];
  features: string[];
  specifications: Record<string, string>;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('100 gm');
  const [isGift, setIsGift] = useState(false);

  // Product data - dynamic based on ID
  const products: Record<number, Product> = {
    1: {
      id: 1,
      name: "Goodnight Kiss",
      price: 790.00,
      originalPrice: 990.00,
      description: "Goodnight Kiss with timeless Eucalyptus and Lavender is the perfectly relaxing candle, as you prepare to unwind after a long day.",
      images: [product1_1, product1_2, product1_3, product1_4],
      sizes: ['100 gm', '160 gm'],
      features: [
        "Hand-poured with premium soy wax",
        "Long-lasting burn time of 30+ hours",
        "Natural cotton wick",
        "Reusable glass container"
      ],
      specifications: {
        "Burn Time": "30-35 hours",
        "Wax Type": "Premium Soy Wax",
        "Wick": "Cotton Wick",
        "Fragrance": "Eucalyptus & Lavender",
        "Container": "Reusable Glass"
      }
    },
    2: {
      id: 2,
      name: "Serenity Blend",
      price: 850.00,
      originalPrice: 1050.00,
      description: "Serenity Blend with premium vanilla and sandalwood creates the perfect ambiance for relaxation and tranquility in your home.",
      images: [product2_1, product2_2, product2_3, product2_4],
      sizes: ['100 gm', '160 gm'],
      features: [
        "Hand-poured with premium soy wax",
        "Long-lasting burn time of 35+ hours",
        "Natural cotton wick",
        "Reusable glass container"
      ],
      specifications: {
        "Burn Time": "35-40 hours",
        "Wax Type": "Premium Soy Wax",
        "Wick": "Cotton Wick",
        "Fragrance": "Vanilla & Sandalwood",
        "Container": "Reusable Glass"
      }
    }
  };

  const product = products[parseInt(id || '1')] || products[1];

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', { product, size: selectedSize, isGift });
  };

  const handleBuyNow = () => {
    // Buy now logic here
    console.log('Buy now:', { product, size: selectedSize, isGift });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-accent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collection
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index 
                      ? 'border-primary shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information Section */}
          <div className="space-y-6">
            {/* Product Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-primary">
                  Rs. {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    Rs. {product.originalPrice.toFixed(2)}
                  </span>
                )}
                <Badge variant="secondary" className="text-green-600">
                  {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
                </Badge>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Size</h3>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => handleSizeChange(size)}
                    className="min-w-[80px]"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Gift Option */}
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <Checkbox 
                id="gift-option" 
                checked={isGift}
                onCheckedChange={(checked) => setIsGift(checked === true)}
              />
              <label 
                htmlFor="gift-option" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Make it a gift
              </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCart}
                variant="outline" 
                className="w-full py-6 text-lg font-semibold border-2 hover:bg-accent"
              >
                ADD TO CART
              </Button>
              <Button 
                onClick={handleBuyNow}
                className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90"
              >
                BUY IT NOW
              </Button>
            </div>

            {/* Action Icons */}
            <div className="flex justify-center gap-6 pt-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Add to Wishlist
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-1/2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="behind-scenes">Behind The Scenes</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {product.description}
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Key Features:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="behind-scenes" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-4">Crafted with Care</h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Each Goodnight Kiss candle is carefully hand-poured by our skilled artisans using premium soy wax and natural cotton wicks. The enchanting blend of eucalyptus and lavender essential oils is precisely measured to create the perfect ambiance for relaxation.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Our sustainable approach ensures that every candle not only provides a luxurious experience but also supports eco-friendly practices. The reusable glass container can be repurposed after your candle has finished burning.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center border-b border-border pb-2">
                        <span className="font-medium text-foreground">{key}:</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Shipping and Returns */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold text-foreground mb-4">Shipping and Returns</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div>
                  <h5 className="font-medium text-foreground mb-2">Shipping</h5>
                  <p>Free shipping on orders above Rs. 1,000</p>
                  <p>Standard delivery: 3-5 business days</p>
                  <p>Express delivery: 1-2 business days</p>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-2">Returns</h5>
                  <p>30-day return policy</p>
                  <p>Items must be unused and in original packaging</p>
                  <p>Free returns for defective items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;