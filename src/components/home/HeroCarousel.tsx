import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  imageUrl?: string;
  overlayClass?: string;
}

const defaultSlides: HeroSlide[] = [
  {
    id: "1",
    title: "Cuidamos la salud de tu mascota",
    subtitle: "Farmacia veterinaria de confianza con productos de calidad, medicamentos y accesorios para perros y gatos.",
    buttonText: "Ver Farmacia",
    buttonLink: "/coleccion/farmacia",
    secondaryButtonText: "Contactanos",
    secondaryButtonLink: "/contacto",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80",
    overlayClass: "bg-primary/60",
  },
  {
    id: "2",
    title: "Ofertas especiales",
    subtitle: "Descubrí los mejores descuentos en productos para tu mascota. Aprovechá nuestras ofertas por tiempo limitado.",
    buttonText: "Ver Ofertas",
    buttonLink: "/coleccion/ofertas",
    imageUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&q=80",
    overlayClass: "bg-accent/60",
  },
  {
    id: "3",
    title: "Alimentos Premium",
    subtitle: "Las mejores marcas de alimento balanceado para perros y gatos. Nutrición de calidad para una vida saludable.",
    buttonText: "Ver Alimentos",
    buttonLink: "/coleccion/alimentos",
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1920&q=80",
    overlayClass: "bg-emerald-700/60",
  },
];

interface HeroCarouselProps {
  slides?: HeroSlide[];
  autoplayDelay?: number;
}

export function HeroCarousel({ slides = defaultSlides, autoplayDelay = 5000 }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi || !autoplayDelay) return;
    
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [emblaApi, autoplayDelay]);

  return (
    <section className="relative overflow-hidden px-4 sm:px-5 lg:px-8 2xl:px-10 pt-4 sm:pt-5 lg:pt-8 2xl:pt-10">
      <div ref={emblaRef} className="overflow-hidden rounded-xl">
        <div className="flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex-[0_0_100%] min-w-0 relative"
            >
              {/* Background Image */}
              {slide.imageUrl && (
                <img
                  src={slide.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              {/* Overlay */}
              <div className={`absolute inset-0 ${slide.overlayClass || "bg-primary/60"}`} />
              
              {/* Content */}
              <div className="container py-16 md:py-24 relative z-10">
                <div className="max-w-2xl animate-fade-in">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-white drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button asChild size="lg" variant="secondary" className="text-foreground">
                      <Link to={slide.buttonLink}>{slide.buttonText}</Link>
                    </Button>
                    {slide.secondaryButtonText && slide.secondaryButtonLink && (
                      <Button 
                        asChild 
                        size="lg" 
                        variant="outline" 
                        className="border-white text-white hover:bg-white/10"
                      >
                        <Link to={slide.secondaryButtonLink}>{slide.secondaryButtonText}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`rounded-full transition-all ${
                index === selectedIndex
                  ? "w-10 h-3 bg-white"
                  : "w-3 h-3 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
