import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
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

const giftingProducts = [
  {
    id: 'gift1',
    name: "Premium Gift Set",
    price: 1299.00,
    originalPrice: 1599.00,
    description: "Exquisitely crafted candle gift set for special occasions",
    images: [gift1_1, gift1_2, gift1_3, gift1_4, gift1_5, gift1_6],
    features: [
      "Premium soy wax blend",
      "Hand-poured with love",
      "Long-lasting burn time",
      "Elegant packaging",
      "Perfect for gifting"
    ],
    specifications: {
      "Burn Time": "45-50 hours",
      "Wax Type": "Premium Soy Blend",
      "Wick": "Cotton Wick",
      "Package": "Gift Set",
      "Items": "3 Candles + Gift Box"
    }
  },
  {
    id: 'gift2',
    name: "Luxury Heritage Collection",
    price: 1799.00,
    originalPrice: 2199.00,
    description: "A sophisticated collection of artisanal candles with timeless elegance",
    images: [gift2_1, gift2_2, gift2_3, gift2_4, gift2_5, gift2_6],
    features: [
      "Premium beeswax blend",
      "Artisan hand-crafted",
      "60+ hours burn time",
      "Heritage packaging",
      "Signature fragrance collection"
    ],
    specifications: {
      "Burn Time": "60+ hours",
      "Wax Type": "Premium Beeswax Blend",
      "Wick": "Cotton Wick",
      "Package": "Heritage Collection",
      "Items": "5 Candles + Wooden Box"
    }
  }
];

const GiftingSection = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{[key: string]: number}>({});
  const [hoveringProduct, setHoveringProduct] = useState<string | null>(null);

  const handleProductClick = (productId: string, e?: React.MouseEvent) => {
    // Don't navigate if clicking on the Quick Add button
    if (e && (e.target as HTMLElement).closest('.quick-add-btn')) {
      return;
    }
    navigate(`/gift/${productId}`);
  };

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, true); // Gift products default to isGift=true
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart as a gift.`,
    });
  };

  const handleMouseEnter = (productId: string) => {
    setHoveringProduct(productId);
    const product = giftingProducts.find(p => p.id === productId);
    if (!product) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndexes(prev => ({
        ...prev,
        [productId]: ((prev[productId] || 0) + 1) % product.images.length
      }));
    }, 600); // Change image every 600ms
    
    // Store interval ID on the window for cleanup
    (window as any)[`imageChangeInterval_${productId}`] = interval;
  };

  const handleMouseLeave = (productId: string) => {
    setHoveringProduct(null);
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: 0
    }));
    if ((window as any)[`imageChangeInterval_${productId}`]) {
      clearInterval((window as any)[`imageChangeInterval_${productId}`]);
    }
  };

  return (
    <section id="gifting" className="py-20 lg:py-32 bg-luxury-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-primary tracking-wide mb-6">
            Perfect Gifts
          </h2>
          <div className="w-24 h-0.5 bg-luxury-gold mx-auto mb-4"></div>
          <p className="text-lg text-luxury-500 max-w-2xl mx-auto">
            Thoughtfully curated gift sets that bring warmth and elegance to any occasion
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {giftingProducts.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer"
              onClick={(e) => handleProductClick(product.id, e)}
              onMouseEnter={() => handleMouseEnter(product.id)}
              onMouseLeave={() => handleMouseLeave(product.id)}
            >
              {/* Product Image Container */}
              <div className="relative overflow-hidden bg-white rounded-lg mb-6 aspect-square shadow-lg">
                <img
                  src={product.images[currentImageIndexes[product.id] || 0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
                />
                
                {/* Quick Add Button Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-luxury flex items-end justify-center pb-8 gap-4">
                  <Button
                    onClick={(e) => handleQuickAdd(product, e)}
                    variant="luxury-outline"
                    className="quick-add-btn border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-luxury px-6 py-3 font-medium tracking-wider"
                  >
                    QUICK ADD
                  </Button>
                  <Button
                    variant="luxury-outline"
                    className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-luxury px-6 py-3 font-medium tracking-wider"
                  >
                    VIEW DETAILS
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center space-y-3">
                <h3 className="text-2xl lg:text-3xl font-medium text-primary tracking-wide">
                  {product.name}
                </h3>
                <p className="text-lg text-luxury-500 mb-4 max-w-lg mx-auto">
                  {product.description}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-bold text-primary">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16 lg:mt-20">
          <Button
            variant="luxury-outline"
            size="lg"
            className="border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-primary px-12 py-4 font-medium tracking-widest transition-all duration-500 ease-luxury"
            onClick={() => navigate('/products')}
          >
            EXPLORE MORE GIFTS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GiftingSection;