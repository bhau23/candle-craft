import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Share2 } from "lucide-react";
import product1_1 from "@/assets/products/product1/1.png";
import product1_2 from "@/assets/products/product1/2.png";
import product1_3 from "@/assets/products/product1/3.png";
import product1_4 from "@/assets/products/product1/4.png";
import product2_1 from "@/assets/products/product2/1.png";
import product2_2 from "@/assets/products/product2/2.png";
import product2_3 from "@/assets/products/product2/3.png";
import product2_4 from "@/assets/products/product2/4.png";
import product3_1 from "@/assets/products/product3/1.jpeg";
import product3_2 from "@/assets/products/product3/2.png";
import product3_3 from "@/assets/products/product3/3.jpeg";
import product3_4 from "@/assets/products/product3/4.png";
import product4_1 from "@/assets/products/product4/1.png";
import product4_2 from "@/assets/products/product4/2.jpeg";
import product4_3 from "@/assets/products/product4/3.jpeg";
import product4_4 from "@/assets/products/product4/4.png";
import product5_1 from "@/assets/products/product5/1.jpeg";
import product5_2 from "@/assets/products/product5/2.jpeg";
import product5_3 from "@/assets/products/product5/3.png";
import product5_4 from "@/assets/products/product5/4.jpeg";

interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGift, setIsGift] = useState(false);

  // Product data - dynamic based on ID
  const products: Record<number | string, Product> = {
    1: {
      id: 1,
      name: "Goodnight Kiss",
      price: 790.00,
      originalPrice: 990.00,
      description: "Goodnight Kiss with timeless Eucalyptus and Lavender is the perfectly relaxing candle, as you prepare to unwind after a long day.",
      images: [product1_1, product1_2, product1_3, product1_4],
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
        "Container": "Reusable Glass",
        "Weight": "150 gm"
      }
    },
    2: {
      id: 2,
      name: "Serenity Blend",
      price: 850.00,
      originalPrice: 1050.00,
      description: "Serenity Blend with premium vanilla and sandalwood creates the perfect ambiance for relaxation and tranquility in your home.",
      images: [product2_1, product2_2, product2_3, product2_4],
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
        "Container": "Reusable Glass",
        "Weight": "150 gm"
      }
    },
    3: {
      id: 3,
      name: "Mystic Harmony",
      price: 920.00,
      originalPrice: 1150.00,
      description: "Mystic Harmony with enchanting jasmine and cedar creates a perfect blend for inner peace and spiritual connection in your sacred space.",
      images: [product3_1, product3_2, product3_3, product3_4],
      features: [
        "Hand-poured with premium soy wax",
        "Long-lasting burn time of 38+ hours",
        "Natural cotton wick",
        "Reusable glass container"
      ],
      specifications: {
        "Burn Time": "38-42 hours",
        "Wax Type": "Premium Soy Wax",
        "Wick": "Cotton Wick",
        "Fragrance": "Jasmine & Cedar",
        "Container": "Reusable Glass",
        "Weight": "150 gm"
      }
    },
    4: {
      id: 4,
      name: "Ocean Breeze",
      price: 880.00,
      originalPrice: 1100.00,
      description: "Ocean Breeze with refreshing citrus and sea salt brings the invigorating essence of the ocean into your home for ultimate rejuvenation.",
      images: [product4_1, product4_2, product4_3, product4_4],
      features: [
        "Hand-poured with premium soy wax",
        "Long-lasting burn time of 32+ hours",
        "Natural cotton wick",
        "Reusable glass container"
      ],
      specifications: {
        "Burn Time": "32-36 hours",
        "Wax Type": "Premium Soy Wax",
        "Wick": "Cotton Wick",
        "Fragrance": "Fresh Citrus & Sea Salt",
        "Container": "Reusable Glass",
        "Weight": "150 gm"
      }
    },
    5: {
      id: 5,
      name: "Golden Sanctuary",
      price: 950.00,
      originalPrice: 1200.00,
      description: "Golden Sanctuary with warm amber and honey creates a luxurious atmosphere that envelops your space in comfort and opulence.",
      images: [product5_1, product5_2, product5_3, product5_4],
      features: [
        "Hand-poured with premium soy wax",
        "Long-lasting burn time of 40+ hours",
        "Natural cotton wick",
        "Reusable glass container"
      ],
      specifications: {
        "Burn Time": "40-45 hours",
        "Wax Type": "Premium Soy Wax",
        "Wick": "Cotton Wick",
        "Fragrance": "Warm Amber & Honey",
        "Container": "Reusable Glass",
        "Weight": "150 gm"
      }
    }
  };

  const product = products[parseInt(id || '1')] || products[1];
  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', { product, isGift });
  };

  const handleBuyNow = () => {
    // Buy now logic here
    console.log('Buy now:', { product, isGift });
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
      </div>
    </div>
  );
};

export default ProductDetail;