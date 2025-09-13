import { Button } from "@/components/ui/button";
import candle1 from "@/assets/candle-1.jpg";
import candle2 from "@/assets/candle-2.jpg";
import candle3 from "@/assets/candle-3.jpg";
import candle4 from "@/assets/candle-4.jpg";
import candle5 from "@/assets/candle-5.jpg";
import candle6 from "@/assets/candle-6.jpg";

const products = [
  {
    id: 1,
    name: "Vanilla Dream",
    price: "$45",
    image: candle1,
    description: "Warm vanilla with notes of caramel"
  },
  {
    id: 2,
    name: "Lavender Fields",
    price: "$48",
    image: candle2,
    description: "Calming lavender with bergamot"
  },
  {
    id: 3,
    name: "Eucalyptus Mint",
    price: "$42",
    image: candle3,
    description: "Fresh eucalyptus with cooling mint"
  },
  {
    id: 4,
    name: "Sandalwood Essence",
    price: "$52",
    image: candle4,
    description: "Rich sandalwood with amber"
  },
  {
    id: 5,
    name: "Rose Garden",
    price: "$55",
    image: candle5,
    description: "Delicate rose with peony petals"
  },
  {
    id: 6,
    name: "Cedar Woods",
    price: "$49",
    image: candle6,
    description: "Deep cedar with pine notes"
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer"
            >
              {/* Product Image Container */}
              <div className="relative overflow-hidden bg-luxury-50 rounded-sm mb-4 aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
                />
                
                {/* Quick Add Button Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-luxury flex items-end justify-center pb-6">
                  <Button
                    variant="luxury-outline"
                    className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-luxury px-8 py-3 font-medium tracking-wider"
                  >
                    QUICK ADD
                  </Button>
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

export default ProductGrid;