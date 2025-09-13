import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-luxury-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Us Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium tracking-widest text-white">
              CONTACT US
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:care@candlecraft.in"
                className="block text-luxury-200 hover:text-white transition-colors duration-300 text-sm tracking-wide"
              >
                care@candlecraft.in
              </a>
              <a
                href="tel:+917878752155"
                className="block text-luxury-200 hover:text-white transition-colors duration-300 text-sm tracking-wide"
              >
                +917878752155
              </a>
              <a
                href="https://www.instagram.com/india/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-luxury-200 hover:text-luxury-gold transition-colors duration-300 text-sm tracking-wide"
              >
                <Instagram size={18} />
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium tracking-widest text-white">
              QUICK LINKS
            </h3>
            <div className="space-y-3">
              <a
                href="#"
                className="block text-luxury-200 hover:text-white transition-colors duration-300 text-sm tracking-wide"
              >
                Terms and Conditions
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-luxury-700 my-12"></div>

        {/* Bottom Section */}
        <div className="flex justify-center">
          <div className="text-luxury-400 text-sm tracking-wide">
            © 2025 Candlecraft.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;