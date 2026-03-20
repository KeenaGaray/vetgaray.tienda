import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VideoSlide {
  id: string;
  videoUrl: string;
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

const videoSlides: VideoSlide[] = [
  {
    id: "1",
    videoUrl: "/videos/hero-video-1.mp4",
    badge: "Tienda Veterinaria",
    title: "Tu mejor amigo\nmerece lo mejor",
    subtitle: "Productos premium para perros y gatos. Salud, nutrición y accesorios en un solo lugar.",
    buttonText: "Explorar tienda",
    buttonLink: "/coleccion/todos",
    secondaryButtonText: "Ver Farmacia",
    secondaryButtonLink: "/coleccion/farmacia",
  },
  {
    id: "2",
    videoUrl: "/videos/hero-video-2.mp4",
    badge: "Nutrición Premium",
    title: "Salud que\nse siente",
    subtitle: "Alimentos de primera calidad y medicamentos veterinarios para el bienestar de tu mascota.",
    buttonText: "Ver Alimentos",
    buttonLink: "/coleccion/alimentos",
    secondaryButtonText: "Ver Farmacia",
    secondaryButtonLink: "/coleccion/farmacia",
  },
];

interface HeroCarouselProps {
  autoplayDelay?: number;
}

export function HeroCarousel({ autoplayDelay = 7000 }: HeroCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [contentKey, setContentKey] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const selectedIndexRef = useRef(0);
  const transitioningRef = useRef(false);

  const goTo = useCallback((idx: number) => {
    if (transitioningRef.current || idx === selectedIndexRef.current) return;
    transitioningRef.current = true;

    const prevIdx = selectedIndexRef.current;
    setExitingIndex(prevIdx);
    selectedIndexRef.current = idx;
    setSelectedIndex(idx);
    setContentKey((k) => k + 1);

    // video: el activo arranca desde el inicio, el anterior pausa
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === idx) { v.currentTime = 0; v.play().catch(() => {}); }
      else { v.pause(); }
    });

    // limpiar el exitingIndex luego de que termine la animación
    setTimeout(() => {
      setExitingIndex(null);
      transitioningRef.current = false;
    }, 420);
  }, []);

  const scrollPrev = useCallback(() => {
    const prev = (selectedIndexRef.current - 1 + videoSlides.length) % videoSlides.length;
    goTo(prev);
  }, [goTo]);

  const scrollNext = useCallback(() => {
    const next = (selectedIndexRef.current + 1) % videoSlides.length;
    goTo(next);
  }, [goTo]);

  // Autoplay
  useEffect(() => {
    if (!autoplayDelay) return;
    const interval = setInterval(scrollNext, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplayDelay, scrollNext]);

  return (
    <section className="relative overflow-hidden px-4 sm:px-5 lg:px-8 2xl:px-10 pt-4 sm:pt-5 lg:pt-8 2xl:pt-10 group/hero">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl h-[420px] md:h-[540px] lg:h-[600px]">

        {/* ── CAPA 1: Videos en crossfade ── */}
        {videoSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === selectedIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              src={slide.videoUrl}
              autoPlay={index === 0}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          </div>
        ))}

        {/* ── Gradientes cinematográficos (siempre visibles) ── */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 z-[1]" />

        {/* ── CAPA 2: Texto — activo y saliente conviven aquí ── */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          {videoSlides.map((slide, index) => {
            const isActive = index === selectedIndex;
            const isExiting = index === exitingIndex;
            if (!isActive && !isExiting) return null;

            return (
              <div
                key={isActive ? `active-${contentKey}` : `exit-${contentKey}`}
                className="absolute inset-0 flex items-center"
              >
                <div className="container">
                  <div className="max-w-xl md:max-w-2xl">

                    {/* Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-medium mb-5 ${isExiting ? "hero-badge-exit" : "hero-badge-in"}`}>
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      {slide.badge}
                    </div>

                    {/* Título */}
                    <h1 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold mb-5 leading-[1.05] text-white drop-shadow-xl whitespace-pre-line ${isExiting ? "hero-title-exit" : "hero-title-in"}`}>
                      {slide.title}
                    </h1>

                    {/* Subtítulo */}
                    <p className={`text-base md:text-lg mb-8 text-white/80 max-w-md leading-relaxed drop-shadow ${isExiting ? "hero-sub-exit" : "hero-subtitle-in"}`}>
                      {slide.subtitle}
                    </p>

                    {/* Botones */}
                    <div className={`flex flex-wrap gap-3 ${isExiting ? "hero-btns-exit" : "hero-buttons-in"}`}>
                      <Button
                        asChild
                        size="lg"
                        className="bg-primary text-white hover:bg-primary/90 shadow-xl font-bold rounded-full px-7 text-base"
                      >
                        <Link to={slide.buttonLink}>{slide.buttonText}</Link>
                      </Button>
                      {slide.secondaryButtonText && slide.secondaryButtonLink && (
                        <Button
                          asChild
                          size="lg"
                          className="bg-white/20 backdrop-blur-md border border-white/60 text-white hover:bg-white/35 font-semibold rounded-full px-7 text-base"
                        >
                          <Link to={slide.secondaryButtonLink}>{slide.secondaryButtonText}</Link>
                        </Button>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Flecha izquierda ── */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-all duration-300 hover:bg-black/50 hover:scale-110 hover:border-white/40"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* ── Flecha derecha ── */}
        <button
          onClick={scrollNext}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-all duration-300 hover:bg-black/50 hover:scale-110 hover:border-white/40"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* ── Indicadores ── */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {videoSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-label={`Ir a slide ${index + 1}`}
              className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 ${
                index === selectedIndex ? "w-10" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            >
              {index === selectedIndex && (
                <>
                  <div className="absolute inset-0 bg-white/30 rounded-full" />
                  <div
                    key={contentKey}
                    className="absolute inset-y-0 left-0 bg-white rounded-full hero-progress"
                    style={{ "--progress-duration": `${autoplayDelay}ms` } as React.CSSProperties}
                  />
                </>
              )}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}

export type { VideoSlide as HeroSlide };
