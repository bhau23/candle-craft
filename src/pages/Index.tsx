import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import GiftingSection from "@/components/GiftingSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import heroImage from "@/assets/hero-candles.jpg";

const Index = () => {
  const location = useLocation();

  const scrollToCollection = () => {
    const collectionsSection = document.getElementById('collections');
    if (collectionsSection) {
      collectionsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handle scrolling to sections when navigating from other pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100); // Small delay to ensure page is loaded
    } else if (location.hash) {
      // Handle direct hash navigation (e.g., #home, #collections)
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center space-y-6 px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-wide leading-tight animate-fade-in">
              Light up your world
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light leading-relaxed animate-fade-in delay-300">
              Explore our curated collection of handcrafted candles
            </p>
            <div className="pt-8 animate-fade-in delay-500">
              <Button 
                variant="luxury-outline" 
                size="lg"
                onClick={scrollToCollection}
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary text-base md:text-lg px-8 md:px-12 py-4 md:py-6 font-medium tracking-widest transition-all duration-500 ease-luxury"
              >
                SHOP THE COLLECTION
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Product Collections Section */}
      <ProductGrid />
      
      {/* Gifting Section */}
      <GiftingSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;