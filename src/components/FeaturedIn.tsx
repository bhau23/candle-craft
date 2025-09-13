const FeaturedIn = () => {
  const publications = [
    "VOGUE",
    "GQ", 
    "ELLE DECOR",
    "ARCHITECTURAL DIGEST",
    "HARPER'S BAZAAR"
  ];

  return (
    <section className="py-16 lg:py-24 bg-luxury-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-primary tracking-wide">
            As Seen In
          </h2>
          <div className="w-16 h-0.5 bg-luxury-gold mx-auto mt-6"></div>
        </div>

        {/* Publication Logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
          {publications.map((publication, index) => (
            <div
              key={publication}
              className={`opacity-60 hover:opacity-100 transition-opacity duration-300 ease-luxury animate-fade-in`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <span className="text-xl md:text-2xl lg:text-3xl font-light tracking-widest text-luxury-400 filter grayscale hover:grayscale-0 transition-all duration-300">
                {publication}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedIn;