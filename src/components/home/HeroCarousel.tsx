import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundClass?: string;
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
    backgroundClass: "gradient-hero",
  },
  {
    id: "2",
    title: "Ofertas especiales",
    subtitle: "Descubrí los mejores descuentos en productos para tu mascota. Aprovechá nuestras ofertas por tiempo limitado.",
    buttonText: "Ver Ofertas",
    buttonLink: "/coleccion/ofertas",
    backgroundClass: "bg-gradient-to-br from-accent to-orange-600",
  },
  {
    id: "3",
    title: "Alimentos Premium",
    subtitle: "Las mejores marcas de alimento balanceado para perros y gatos. Nutrición de calidad para una vida saludable.",
    buttonText: "Ver Alimentos",
    buttonLink: "/coleccion/alimentos",
    backgroundClass: "bg-gradient-to-br from-emerald-600 to-emerald-800",
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
    <section className="relative overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`flex-[0_0_100%] min-w-0 ${slide.backgroundClass || "gradient-hero"}`}
            >
              <div className="container py-16 md:py-24">
                <div className="max-w-2xl animate-fade-in">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-primary-foreground">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
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
                        className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
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

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm text-primary-foreground flex items-center justify-center hover:bg-background/30 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm text-primary-foreground flex items-center justify-center hover:bg-background/30 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? "w-8 bg-primary-foreground"
                  : "w-2 bg-primary-foreground/50 hover:bg-primary-foreground/70"
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
