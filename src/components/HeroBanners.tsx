import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AllUniformBanner from '@/assets/1.png';
import HospitalUniforms from "@/assets/2.png";
import IndustrialUniforms from "@/assets/3.png";
import HotelUniforms from "@/assets/4.png"
import CorporateUniforms from "@/assets/5.png"

const HeroBanners = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      image: AllUniformBanner,
      // title: 'Back to School Sale',
      // subtitle: '20% OFF EVERYTHING',
      // description: 'Discount applies at checkout | Valid through 8/9',
      // buttonText: 'Shop Now',
      // buttonLink: '/',
      alt: 'All Uniforms Banner - Next Uniform'
    },
    {
      image: HospitalUniforms,
      // title: 'New Arrivals',
      // subtitle: 'Fresh Styles Just In',
      // description: 'Discover the latest fashion trends',
      // buttonText: 'Explore Now',
      // buttonLink: '/new',
      alt: 'Hospital Uniforms Banner - Next Uniform'
    },
    {
      image: IndustrialUniforms,
      // title: 'New Arrivals',
      // subtitle: 'Fresh Styles Just In',
      // description: 'Discover the latest fashion trends',
      // buttonText: 'Explore Now',
      // buttonLink: '/new',
      alt: 'Industrial Uniforms Banner - Next Uniform'
    },
    {
      image: HotelUniforms,
      // title: 'New Arrivals',
      // subtitle: 'Fresh Styles Just In',
      // description: 'Discover the latest fashion trends',
      // buttonText: 'Explore Now',
      // buttonLink: '/new',
      alt: 'Hotel Uniforms Banner - Next Uniform'
    },
    {
      image: CorporateUniforms,
      // title: 'New Arrivals',
      // subtitle: 'Fresh Styles Just In',
      // description: 'Discover the latest fashion trends',
      // buttonText: 'Explore Now',
      // buttonLink: '/new',
      alt: 'Corporate Uniforms Banner - Next Uniform'
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((s) => (s + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((s) => (s - 1 + banners.length) % banners.length);

  return (
    <section aria-roledescription="carousel" aria-label="Promotional banners" className="relative w-full h-[320px] sm:h-[380px] md:h-[460px] lg:h-[520px] overflow-hidden">
      {/* slides */}
      <div
        className="flex transition-transform duration-600 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={index}
            className="min-w-full h-full relative bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${banner.image})` }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${banners.length}`}
          >
            {/* Hidden/inlined image so crawlers & social bots see alt + image metadata */}
            <img src={banner.image} alt={banner.alt} className="sr-only" />

            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/20"></div>

            {/* <div className="relative z-10 max-w-5xl w-full px-6 sm:px-8 text-center text-white"> */}
              {/* <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-2">
                {banner.title}
              </h2> */}
              {/* <p className="text-sm sm:text-base md:text-lg font-semibold mb-2">{banner.subtitle}</p>
              <p className="text-xs sm:text-sm md:text-base mb-4 max-w-lg mx-auto">{banner.description}</p> */}

              {/* <div className="flex justify-center">
                <Button
                  asChild
                  className="bg-boutique-orange hover:bg-boutique-orange/90 text-white px-4 py-2 sm:px-6 sm:py-3"
                >
                  <a href={banner.buttonLink}>{banner.buttonText}</a>
                </Button>
              </div> */}
            {/* </div> */}
          </div>
        ))}
      </div>

      {/* arrows */}
      <button
        aria-label="Previous slide"
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        aria-label="Next slide"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goToSlide(i)}
            aria-pressed={i === currentSlide}
            className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanners;