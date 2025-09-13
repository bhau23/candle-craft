import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import product1_1 from "@/assets/products/product1/1.png";
import product1_2 from "@/assets/products/product1/2.png";
import product1_3 from "@/assets/products/product1/3.png";
import product1_4 from "@/assets/products/product1/4.png";

const products = [
  {
    id: 1,
    name: "Premium Artisan Candle",
    price: "$45",
    images: [product1_1, product1_2, product1_3, product1_4],
    description: "Handcrafted with premium ingredients"
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
  const navigate = useNavigate();

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
    // Add quick add logic here
    console.log('Quick add clicked for product:', product.id);
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
        <p className="text-lg font-semibold text-luxury-gold">
          {product.price}
        </p>
      </div>
    </div>
  );
};

export default ProductGrid;