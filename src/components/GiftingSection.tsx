import { Button } from "@/components/ui/button";
import candle1 from "@/assets/candle-1.jpg";
import candle2 from "@/assets/candle-2.jpg";
import candle3 from "@/assets/candle-3.jpg";
import candle4 from "@/assets/candle-4.jpg";
import candle5 from "@/assets/candle-5.jpg";
import candle6 from "@/assets/candle-6.jpg";

const giftingProducts = [
  {
    id: 1,
    name: "Starter Gift Set",
    price: "$75",
    image: candle1,
    description: "Perfect introduction to our collection"
  },
  {
    id: 2,
    name: "Relaxation Bundle",
    price: "$120",
    image: candle2,
    description: "Calming scents for ultimate relaxation"
  },
  {
    id: 3,
    name: "Fresh & Clean Kit",
    price: "$95",
    image: candle3,
    description: "Refreshing scents for any space"
  },
  {
    id: 4,
    name: "Luxury Gift Box",
    price: "$180",
    image: candle4,
    description: "Premium collection in elegant packaging"
  },
  {
    id: 5,
    name: "Romance Collection",
    price: "$140",
    image: candle5,
    description: "Romantic scents for special moments"
  },
  {
    id: 6,
    name: "Seasonal Favorites",
    price: "$110",
    image: candle6,
    description: "Curated seasonal scent collection"
  }
];

const GiftingSection = () => {
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {giftingProducts.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer"
            >
              {/* Product Image Container */}
              <div className="relative overflow-hidden bg-white rounded-sm mb-4 aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
                />
                
                {/* Gift Badge */}
                <div className="absolute top-4 left-4 bg-luxury-gold text-primary px-3 py-1 text-xs font-medium tracking-wider rounded-sm">
                  GIFT SET
                </div>
                
                {/* Quick Add Button Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-luxury flex items-end justify-center pb-6">
                  <Button
                    variant="luxury-outline"
                    className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-luxury px-8 py-3 font-medium tracking-wider"
                  >
                    ADD TO CART
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
            VIEW ALL GIFT SETS
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GiftingSection;