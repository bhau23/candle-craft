import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { AuthPromptDialog } from "./auth/AuthPromptDialog";
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

const products = [
  {
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
  {
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
  {
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
  {
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
  {
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
];

const ProductGrid = () => {
  return (
    <section id="collections" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-primary tracking-wide mb-6">
            Our Collections
          </h2>
          <div className="w-24 h-0.5 bg-luxury-gold mx-auto"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-center">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16 lg:mt-20">
          <Button
            variant="luxury-outline"
            size="lg"
            className="border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-primary px-12 py-4 font-medium tracking-widest transition-all duration-500 ease-luxury"
          >
            VIEW ALL COLLECTIONS
          </Button>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: any }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleMouseEnter = () => {
    setIsHovering(true);
    // Start cycling through images when hovering
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 800); // Change image every 800ms

    // Store interval ID to clear it later
    (window as any).imageInterval = interval;
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCurrentImageIndex(0); // Reset to first image
    // Clear the interval
    if ((window as any).imageInterval) {
      clearInterval((window as any).imageInterval);
      (window as any).imageInterval = null;
    }
  };

  const handleProductClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the Quick Add button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      addToCart(product);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error: any) {
      if (error.message === 'AUTHENTICATION_REQUIRED') {
        setShowAuthPrompt(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div
      className="group cursor-pointer max-w-sm"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleProductClick}
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-luxury-50 rounded-sm mb-4 aspect-square">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 ease-luxury group-hover:scale-105"
        />
        
        {/* Quick Add Button Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-luxury flex items-end justify-center pb-6">
          <Button
            onClick={handleQuickAdd}
            variant="luxury-outline"
            className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-luxury px-8 py-3 font-medium tracking-wider"
          >
            QUICK ADD
          </Button>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {product.images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="text-center space-y-2">
        <h3 className="text-lg lg:text-xl font-medium text-primary tracking-wide">
          {product.name}
        </h3>
        <p className="text-sm text-luxury-500 mb-2">
          {product.description}
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-lg font-bold text-primary">
            ₹{product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ₹{product.originalPrice.toFixed(2)}
          </span>
          <span className="text-xs text-green-600 font-medium">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </span>
        </div>
      </div>

      {/* Authentication Prompt Dialog */}
      <AuthPromptDialog
        open={showAuthPrompt}
        onOpenChange={setShowAuthPrompt}
        action="add-to-cart"
      />
    </div>
  );
};

export default ProductGrid;