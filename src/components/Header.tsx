import { useState, useEffect, useRef } from "react";
import { Search, User, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logos/logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartSummary } = useCart();
  const { currentUser, userProfile, logout } = useAuth();
  const cartSummary = getCartSummary();

  // All searchable products data
  const allProducts = [
    // Regular products
    { id: 1, name: "Goodnight Kiss", type: "product", price: "₹790", description: "Eucalyptus & Lavender blend for relaxation" },
    { id: 2, name: "Serenity Blend", type: "product", price: "₹850", description: "Vanilla & Sandalwood for tranquility" },
    { id: 3, name: "Mystic Harmony", type: "product", price: "₹920", description: "Jasmine & Cedar blend for inner peace" },
    { id: 4, name: "Ocean Breeze", type: "product", price: "₹880", description: "Fresh citrus & sea salt for rejuvenation" },
    { id: 5, name: "Golden Sanctuary", type: "product", price: "₹950", description: "Warm amber & honey for luxurious comfort" },
    // Gift products
    { id: 'gift1', name: "Premium Gift Set", type: "gift", price: "₹1,299", description: "Exquisitely crafted candle gift set for special occasions" },
    { id: 'gift2', name: "Luxury Heritage Collection", type: "gift", price: "₹1,799", description: "A sophisticated collection of artisanal candles with timeless elegance" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        // Only close if we're not clicking on a suggestion
        const clickedElement = event.target as HTMLElement;
        const isClickingOnSuggestion = clickedElement.closest('.search-suggestion-button');
        
        if (!isClickingOnSuggestion) {
          setIsSearchOpen(false);
          setShowSuggestions(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleProductSelect = (product: any) => {
    // Navigate immediately without closing search first
    if (product.type === 'gift') {
      const giftUrl = `/gift/${product.id}`;
      navigate(giftUrl);
    } else {
      const productUrl = `/product/${product.id}`;
      navigate(productUrl);
    }
    
    // Close search after navigation
    setTimeout(() => {
      setIsSearchOpen(false);
      setSearchQuery("");
      setShowSuggestions(false);
    }, 50);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchSuggestions.length > 0) {
      handleProductSelect(searchSuggestions[0]);
    }
  };

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else if (sectionId === 'home') {
      // Fallback: scroll to top if home section not found
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Navigation handler for links
  const handleNavigation = (linkId: string) => {
    if (linkId === 'about') {
      navigate('/about');
    } else if (linkId === 'home') {
      if (location.pathname === '/') {
        // We're on home page, scroll to home section (top)
        scrollToSection('home');
      } else {
        // We're on a different page, navigate to home page
        navigate('/');
      }
    } else {
      // For other sections (collections, gifting), check if we're on home page
      if (location.pathname === '/') {
        // We're on home page, scroll to section
        scrollToSection(linkId);
      } else {
        // We're on a different page, navigate to home and scroll to section
        navigate('/', { state: { scrollTo: linkId } });
      }
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  // Handle authentication actions
  const handleAuthAction = () => {
    if (currentUser) {
      // User is logged in, redirect based on role
      if (userProfile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      // User is not logged in, redirect to auth page
      navigate('/auth');
    }
  };

  const handleCartClick = () => {
    if (currentUser) {
      navigate('/cart');
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
          <div 
            className="flex-shrink-0 h-10 md:h-16 w-32 md:w-44 overflow-hidden rounded-md bg-white/5 cursor-pointer"
            onClick={() => handleNavigation('home')}
          >
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
                onClick={() => handleNavigation(link.id)}
                className="text-sm font-medium tracking-wider text-luxury-700 hover:text-luxury-gold transition-colors duration-300 ease-luxury relative group cursor-pointer bg-transparent border-none"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-300 ease-luxury group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Section */}
            <div ref={searchContainerRef} className="relative">
              <Button 
                variant="luxury-ghost" 
                size="icon" 
                className="relative"
                onClick={handleSearchToggle}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
            
            {/* User Authentication */}
            <div className="flex items-center space-x-2">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="luxury-ghost" 
                    size="icon" 
                    className="relative"
                    onClick={handleAuthAction}
                    title={userProfile?.fullName || 'Profile'}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="luxury-ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="luxury-ghost" 
                  size="icon" 
                  className="relative"
                  onClick={handleAuthAction}
                  title="Login / Sign Up"
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>
            
            <Button 
              variant="luxury-ghost" 
              size="icon" 
              className="relative"
              onClick={handleCartClick}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartSummary.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-luxury-gold text-primary text-xs rounded-full flex items-center justify-center font-medium">
                  {cartSummary.totalItems}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-1">
            <Button 
              variant="luxury-ghost" 
              size="icon" 
              className="relative h-10 w-10"
              onClick={handleCartClick}
            >
              <ShoppingBag className="h-4 w-4" />
              {cartSummary.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-luxury-gold text-primary text-xs rounded-full flex items-center justify-center font-medium text-[10px]">
                  {cartSummary.totalItems}
                </span>
              )}
            </Button>
            <Button
              variant="luxury-ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-10 w-10"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Desktop Search Bar - Full Width Overlay */}
        {isSearchOpen && (
          <div className="hidden md:block absolute left-0 right-0 top-full bg-white border-t border-luxury-200 shadow-luxury-lg z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSearchSubmit} className="flex gap-3">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-12 text-base border-luxury-200 focus:border-luxury-gold rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="luxury-ghost"
                    size="icon"
                    onClick={handleSearchToggle}
                    className="h-12 w-12 border border-luxury-200 rounded-lg hover:bg-luxury-50"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </form>
                
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="mt-3 bg-white rounded-lg shadow-luxury-xl border border-luxury-200 max-h-80 overflow-y-auto">
                    {searchSuggestions.map((product, index) => (
                      <button
                        key={`${product.type}-${product.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('=== BUTTON CLICKED ===');
                          handleProductSelect(product);
                        }}
                        className="search-suggestion-button w-full text-left p-4 hover:bg-luxury-50 transition-colors duration-200 border-b border-luxury-50 last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-luxury-900">{product.name}</p>
                            <p className="text-sm text-luxury-600 mt-1 line-clamp-1">{product.description}</p>
                            <span className="inline-block text-xs bg-luxury-100 text-luxury-700 px-2 py-1 rounded-full mt-2">
                              {product.type === 'gift' ? 'Gift Set' : 'Candle'}
                            </span>
                          </div>
                          <span className="text-lg font-semibold text-luxury-gold ml-4">{product.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* No results message */}
                {showSuggestions && searchQuery.trim() && searchSuggestions.length === 0 && (
                  <div className="mt-3 bg-white rounded-lg shadow-luxury-xl border border-luxury-200 p-6 text-center text-luxury-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-luxury-300" />
                    <p>No products found for "<span className="font-medium">{searchQuery}</span>"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-background border-t border-luxury-200 shadow-luxury-lg z-40">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="pb-4 border-b border-luxury-200">
                <div className="relative" ref={searchContainerRef}>
                  <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 h-12 text-base border-luxury-200 focus:border-luxury-gold"
                    />
                    <Button
                      type="submit"
                      variant="luxury-ghost"
                      size="icon"
                      className="h-12 w-12 border border-luxury-200"
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </form>
                  
                  {/* Mobile Search Suggestions */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-luxury-xl border border-luxury-200 max-h-64 overflow-y-auto z-50">
                      {searchSuggestions.map((product, index) => (
                        <button
                          key={`mobile-${product.type}-${product.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('=== MOBILE BUTTON CLICKED ===');
                            handleProductSelect(product);
                            setIsMobileMenuOpen(false);
                          }}
                          className="search-suggestion-button w-full text-left p-4 hover:bg-luxury-50 transition-colors duration-200 border-b border-luxury-50 last:border-b-0"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-luxury-900">{product.name}</p>
                              <p className="text-sm text-luxury-600 mt-1 line-clamp-2">{product.description}</p>
                              <span className="inline-block text-xs bg-luxury-100 text-luxury-700 px-2 py-1 rounded-full mt-2">
                                {product.type === 'gift' ? 'Gift Set' : 'Candle'}
                              </span>
                            </div>
                            <span className="font-semibold text-luxury-gold ml-3">{product.price}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Mobile No results message */}
                  {showSuggestions && searchQuery.trim() && searchSuggestions.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-luxury-xl border border-luxury-200 p-4 text-center text-luxury-500 z-50">
                      No products found for "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
              
              {navigationLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavigation(link.id)}
                  className="block text-base font-medium text-luxury-700 hover:text-luxury-gold transition-colors duration-300 ease-luxury py-2 bg-transparent border-none cursor-pointer w-full text-left"
                >
                  {link.name}
                </button>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="flex items-center justify-between pt-4 border-t border-luxury-200">
                {currentUser ? (
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="luxury-ghost"
                      size="sm"
                      onClick={() => {
                        handleAuthAction();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm">
                        {userProfile?.role === 'admin' ? 'Admin Panel' : 'My Profile'}
                      </span>
                    </Button>
                    <Button
                      variant="luxury-ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="luxury-ghost"
                    size="sm"
                    onClick={() => {
                      handleAuthAction();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm">Login / Sign Up</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;