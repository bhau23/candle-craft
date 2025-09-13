import { useState, useEffect } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logos/logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const navigationLinks = [
    { name: "HOME", id: "home" },
    { name: "COLLECTIONS", id: "collections" },
    { name: "GIFTING", id: "gifting" },
    { name: "ABOUT US", id: "about" }
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-background transition-all duration-300 ease-luxury ${
        isScrolled ? "shadow-luxury-md" : ""
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 h-12 md:h-16 w-36 md:w-44 overflow-hidden rounded-md bg-white/5">
            <img 
              src={logo} 
              alt="Candle Craft Logo" 
              className="h-full w-full object-cover scale-150 transform origin-center"
              style={{
                filter: 'contrast(1.3) brightness(1.2) saturate(1.1)',
                objectPosition: 'center center',
                clipPath: 'inset(15% 10% 15% 10%)'
              }}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {navigationLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => link.id !== 'about' ? scrollToSection(link.id) : undefined}
                className="text-sm font-medium tracking-wider text-luxury-700 hover:text-luxury-gold transition-colors duration-300 ease-luxury relative group cursor-pointer bg-transparent border-none"
                disabled={link.id === 'about'}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-300 ease-luxury group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="luxury-ghost" size="icon" className="relative">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="luxury-ghost" size="icon" className="relative">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="luxury-ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-luxury-gold text-primary text-xs rounded-full flex items-center justify-center font-medium">
                2
              </span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button variant="luxury-ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-luxury-gold text-primary text-xs rounded-full flex items-center justify-center font-medium">
                2
              </span>
            </Button>
            <Button
              variant="luxury-ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-background border-t border-luxury-200 shadow-luxury-lg">
            <div className="px-4 py-6 space-y-4">
              {navigationLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => link.id !== 'about' ? scrollToSection(link.id) : undefined}
                  className="block text-base font-medium text-luxury-700 hover:text-luxury-gold transition-colors duration-300 ease-luxury py-2 bg-transparent border-none cursor-pointer w-full text-left"
                  disabled={link.id === 'about'}
                >
                  {link.name}
                </button>
              ))}
              <div className="flex items-center space-x-4 pt-4 border-t border-luxury-200">
                <Button variant="luxury-ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="luxury-ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;