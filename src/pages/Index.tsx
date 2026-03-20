import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { OffersCarousel } from "@/components/home/OffersCarousel";
import { PetCategorySection } from "@/components/home/PetCategorySection";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Truck, Shield, Clock, Heart, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";


const features = [
  { icon: Truck,   title: "Envío a todo el país",      description: "Llegamos a donde estés, sin excusas" },
  { icon: Shield,  title: "Productos originales",       description: "100% garantizados, directo del fabricante" },
  { icon: Clock,   title: "Atención personalizada",     description: "Asesoramiento veterinario profesional" },
  { icon: Heart,   title: "+10 años de experiencia",    description: "Cuidando mascotas desde 2014" },
];

export default function Index() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const promoRef = useRef<HTMLElement>(null);
  const [promoVisible, setPromoVisible] = useState(false);

  // Embla carousel for featured products
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false, dragFree: false });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    setScrollProgress(Math.max(0, Math.min(1, emblaApi.scrollProgress())));
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll();
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    return () => { emblaApi.off("scroll", onScroll); emblaApi.off("reInit", onScroll); };
  }, [emblaApi, onScroll]);

  const sortedProducts = useMemo(() => [...products], [products]);

  useEffect(() => {
    const el = promoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setPromoVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetchProducts(12);
        setProducts(response.data.products.edges);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <Layout>
      <HeroCarousel />
      <PetCategorySection />
      <OffersCarousel />

      {/* Promo Banner Grid */}
      <section ref={promoRef} className="py-10 md:py-14 px-4 sm:px-5 lg:px-8 2xl:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">

          {/* Rascadores — full width on mobile, tall vertical left on desktop */}
          <Link to="/coleccion/accesorios"
            className={`col-span-2 md:col-span-1 md:row-span-2 relative overflow-hidden rounded-2xl group cursor-pointer min-h-[220px] md:min-h-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${promoVisible ? 'animate-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '0ms' }}
          >
            <img
              src="https://cdn.petsathome.com/public/images/products/900_7150484.jpg"
              alt="Rascadores y Juguetes"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-widest text-white bg-black/30 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-white/20">
                Para que se entretengan
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <h3 className="font-display font-bold text-lg md:text-xl text-white leading-tight mb-3">Rascadores &amp; Juguetes</h3>
              <span className="inline-flex items-center gap-1.5 bg-white text-foreground text-xs md:text-sm font-semibold px-3.5 py-1.5 md:px-4 md:py-2 rounded-full group-hover:gap-2.5 transition-all duration-200">
                Ver más <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </span>
            </div>
          </Link>

          {/* Salud & Medicamentos — full width on mobile, wide top-right on desktop */}
          <Link to="/coleccion/farmacia"
            className={`col-span-2 relative overflow-hidden rounded-2xl group cursor-pointer min-h-[220px] md:min-h-[280px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${promoVisible ? 'animate-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '110ms' }}
          >
            <img
              src="https://i.pinimg.com/1200x/8a/dc/86/8adc86c1d101d935e4ef5ed92eee28e6.jpg"
              alt="Salud y Medicamentos"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-widest text-white bg-black/30 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-white/20">
                Farmacia veterinaria
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <h3 className="font-display font-bold text-lg md:text-xl text-white leading-tight mb-3">Salud &amp; Medicamentos</h3>
              <span className="inline-flex items-center gap-1.5 bg-white text-foreground text-xs md:text-sm font-semibold px-3.5 py-1.5 md:px-4 md:py-2 rounded-full group-hover:gap-2.5 transition-all duration-200">
                Ver farmacia <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </span>
            </div>
          </Link>

          {/* Moisés & Camas — half width on mobile, single cell bottom-middle on desktop */}
          <Link to="/coleccion/accesorios-camas-y-moises"
            className={`col-span-1 relative overflow-hidden rounded-2xl group cursor-pointer min-h-[190px] md:min-h-[300px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${promoVisible ? 'animate-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '220ms' }}
          >
            <img
              src="https://cdn.petsathome.com/public/images/products/900_P71631.jpg"
              alt="Moisés y Camas"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute top-3 left-3 md:top-5 md:left-5">
              <span className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-widest text-white bg-black/30 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-white/20">
                Para descansar
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
              <h3 className="font-display font-bold text-sm md:text-xl text-white leading-tight mb-2 md:mb-4">Moisés &amp; Camas</h3>
              <span className="inline-flex items-center gap-1 bg-white text-foreground text-xs font-semibold px-3 py-1.5 rounded-full group-hover:gap-2 transition-all duration-200">
                Ver camas <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Alimentos — half width on mobile, single cell bottom-right on desktop */}
          <Link to="/coleccion/alimentos"
            className={`col-span-1 relative overflow-hidden rounded-2xl group cursor-pointer min-h-[190px] md:min-h-[300px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${promoVisible ? 'animate-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '330ms' }}
          >
            <img
              src="https://i.pinimg.com/1200x/f0/a7/08/f0a708f28e56ce16a8389f81bf215e6b.jpg"
              alt="Alimentos para mascotas"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute top-3 left-3 md:top-5 md:left-5">
              <span className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-widest text-white bg-black/30 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-white/20">
                Nutrición premium
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
              <h3 className="font-display font-bold text-sm md:text-xl text-white leading-tight mb-2 md:mb-4">Alimentos</h3>
              <span className="inline-flex items-center gap-1 bg-white text-foreground text-xs font-semibold px-3 py-1.5 rounded-full group-hover:gap-2 transition-all duration-200">
                Ver alimentos <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-background px-4 sm:px-5 lg:px-8 2xl:px-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
            Tus mascotas lo<br className="hidden sm:block" /> van a amar...
          </h2>
          <Button asChild variant="outline" className="hidden sm:flex font-semibold rounded-full shrink-0">
            <Link to="/coleccion/todos">Ver todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No hay productos disponibles</div>
        ) : (
          <>
            {/* Carousel */}
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-4">
                {sortedProducts.map((product) => (
                  <div
                    key={product.node.id}
                    className="flex-none w-[260px]"
                  >
                    <ProductCard product={product} showStars={true} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation bar */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canPrev}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground disabled:opacity-30 hover:border-primary hover:text-primary transition-colors shrink-0"
                aria-label="Anterior"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Progress bar */}
              <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.max(scrollProgress * 100, 8)}%` }}
                />
              </div>

              <button
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canNext}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground disabled:opacity-30 hover:border-primary hover:text-primary transition-colors shrink-0"
                aria-label="Siguiente"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 sm:hidden text-center">
              <Button asChild variant="outline" className="font-semibold rounded-full">
                <Link to="/coleccion/todos">Ver todos los productos <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </>
        )}
      </section>

      {/* Why Vet Garay — split layout */}
      <section className="py-16 md:py-24 px-4 sm:px-5 lg:px-8 2xl:px-10 bg-secondary/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&q=85"
              alt="Perro feliz"
              className="relative z-10 w-full rounded-3xl object-cover aspect-[4/3] shadow-xl"
            />
          </div>

          {/* Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Por qué elegirnos</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground leading-tight mb-4">
              Ayudamos a tu mascota a vivir su mejor vida
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              En Vet Garay encontrás todo lo que tu mascota necesita: desde alimentos premium hasta farmacia veterinaria, con el respaldo de profesionales que aman a los animales tanto como vos.
            </p>
            <ul className="space-y-4 mb-8">
              {features.map((f) => (
                <li key={f.title} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">{f.title}</span>
                    <span className="text-muted-foreground"> — {f.description}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Button asChild className="rounded-full font-semibold px-8">
              <Link to="/coleccion/todos">Explorar tienda <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
