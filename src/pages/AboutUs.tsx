import Header from "@/components/Header";
import Footer from "@/components/Footer";
import aboutBg from "@/assets/images/about-bg.png";
import story1 from "@/assets/aboutus/1.png";
import story2 from "@/assets/aboutus/2.jpeg";
import story3 from "@/assets/aboutus/3.jpeg";
import story4 from "@/assets/aboutus/4.jpeg";
import story5 from "@/assets/aboutus/5.jpeg";

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with Background */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${aboutBg})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Our Story
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed opacity-90">
            Every candle tells a story. Ours begins with a passion for creating 
            moments of tranquility and beauty in your everyday life. From our 
            hands to your home, each candle is crafted with love, care, and an 
            unwavering commitment to excellence.
          </p>
        </div>
      </section>

      {/* Story Section 1 - The Beginning */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                The Beginning
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                It all started in a small workshop with a simple dream - to bring 
                warmth and serenity into homes through the gentle glow of candles. 
                What began as a passion project has grown into a labor of love, 
                where each candle represents our commitment to quality and craftsmanship.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our founders believed that lighting a candle should be more than 
                just illumination - it should be a ritual of mindfulness, a moment 
                to pause and appreciate the beauty in simplicity.
              </p>
            </div>
            <div className="lg:order-first">
              <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100">
                <img 
                  src={story1} 
                  alt="The beginning of our journey" 
                  className="w-full h-auto min-h-[400px] max-h-[500px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section 2 - Craftsmanship */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Artisan Craftsmanship
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every candle is hand-poured with meticulous attention to detail. 
                We use only the finest natural wax blends and premium fragrances, 
                ensuring each candle burns cleanly and fills your space with 
                captivating scents that transport you to another world.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our master craftsmen have perfected the art of candle-making, 
                combining traditional techniques with modern innovation to create 
                products that are both beautiful and functional.
              </p>
            </div>
            <div>
              <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100">
                <img 
                  src={story2} 
                  alt="Artisan craftsmanship in action" 
                  className="w-full h-auto min-h-[400px] max-h-[500px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section 3 - Sustainability */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Sustainable Practices
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe in creating beauty without compromising our planet. 
                Our commitment to sustainability runs deep - from sourcing 
                eco-friendly materials to using recyclable packaging, every 
                decision reflects our respect for the environment.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our plant-based wax formulations burn cleaner and longer, while 
                our cotton wicks are lead-free and provide the perfect flame for 
                optimal scent throw and ambiance.
              </p>
            </div>
            <div className="lg:order-first">
              <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100">
                <img 
                  src={story3} 
                  alt="Sustainable candle making practices" 
                  className="w-full h-auto min-h-[400px] max-h-[500px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section 4 - Community */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Building Community
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're more than just a candle company - we're a community of 
                people who value mindfulness, beauty, and the simple pleasures 
                in life. Our customers inspire us every day with their stories 
                of how our candles have become part of their daily rituals.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                From romantic dinners to relaxing baths, from meditation sessions 
                to cozy reading nooks, our candles help create the perfect 
                atmosphere for life's special moments.
              </p>
            </div>
            <div>
              <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100">
                <img 
                  src={story4} 
                  alt="Our community of candle lovers" 
                  className="w-full h-auto min-h-[400px] max-h-[500px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section 5 - The Future */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Looking Forward
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                As we continue to grow, our mission remains unchanged - to create 
                exceptional candles that bring joy, comfort, and beauty into your 
                life. We're constantly innovating, exploring new fragrances, and 
                pushing the boundaries of what a candle can be.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Thank you for being part of our journey. Every candle we make, 
                every fragrance we craft, and every moment of warmth we create 
                is inspired by you.
              </p>
            </div>
            <div className="lg:order-first">
              <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100">
                <img 
                  src={story5} 
                  alt="The future of our candle journey" 
                  className="w-full h-auto min-h-[400px] max-h-[500px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            Our Mission
          </h2>
          <p className="text-xl leading-relaxed mb-12 opacity-90">
            To illuminate life's precious moments with candles that embody beauty, 
            quality, and mindfulness. We create more than products - we craft 
            experiences that transform your space into a sanctuary of peace and joy.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Quality</h3>
              <p className="opacity-80">
                Every candle meets our exacting standards for excellence and craftsmanship.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Sustainability</h3>
              <p className="opacity-80">
                We protect our planet through eco-conscious materials and practices.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Mindfulness</h3>
              <p className="opacity-80">
                Our candles inspire moments of reflection and tranquility in busy lives.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Begin Your Journey?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Discover our collection of handcrafted candles and find the perfect 
              scent to transform your space.
            </p>
            <a 
              href="/" 
              className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Explore Our Collection
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;