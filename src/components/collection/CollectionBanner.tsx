import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Bone, Fish, Pill, ShoppingBag, Heart, Scissors, Tag, Star, Utensils, Shield, Gift, Syringe } from "lucide-react";
import categoryDogsImg from "@/assets/category-dogs.png";
import categoryCatsImg from "@/assets/category-cats.png";

type IconComponent = React.ComponentType<{ className?: string }>;

interface FloatingIcon {
  icon: IconComponent;
  className: string;
}

interface BannerConfig {
  title: string;
  blobColor: string;
  blobShape: string;
  localAsset?: "dogs" | "cats";
  floatingIcons: FloatingIcon[];
}

const BANNER_CONFIGS: Record<string, BannerConfig> = {
  perros: {
    title: "Todo para tu Perro",
    blobColor: "bg-amber-100",
    blobShape: "42% 58% 44% 56% / 57% 43% 57% 43%",
    localAsset: "dogs",
    floatingIcons: [
      { icon: Bone,        className: "absolute top-4 left-6 w-9 h-9 opacity-20 -rotate-12" },
      { icon: ShoppingBag, className: "absolute top-14 right-10 w-7 h-7 opacity-15 rotate-6" },
      { icon: Heart,       className: "absolute bottom-10 left-8 w-10 h-10 opacity-20 -rotate-6" },
      { icon: Bone,        className: "absolute bottom-4 right-24 w-6 h-6 opacity-15 rotate-45" },
      { icon: Tag,         className: "absolute top-1/2 left-[38%] w-7 h-7 opacity-10 rotate-12" },
      { icon: Utensils,    className: "absolute top-6 left-[45%] w-6 h-6 opacity-15 -rotate-6" },
    ],
  },
  gatos: {
    title: "Todo para tu Gato",
    blobColor: "bg-violet-100",
    blobShape: "61% 39% 52% 48% / 44% 59% 41% 56%",
    localAsset: "cats",
    floatingIcons: [
      { icon: Fish,      className: "absolute top-4 left-6 w-9 h-9 opacity-20 rotate-12" },
      { icon: Heart,     className: "absolute top-14 right-10 w-7 h-7 opacity-15 -rotate-6" },
      { icon: Scissors,  className: "absolute bottom-10 left-8 w-10 h-10 opacity-20 rotate-12" },
      { icon: Fish,      className: "absolute bottom-4 right-24 w-6 h-6 opacity-15 -rotate-20" },
      { icon: Star,      className: "absolute top-1/2 left-[38%] w-7 h-7 opacity-10 -rotate-12" },
      { icon: Heart,     className: "absolute top-6 left-[45%] w-6 h-6 opacity-15 rotate-6" },
    ],
  },
  farmacia: {
    title: "Farmacia Veterinaria",
    blobColor: "bg-sky-100",
    blobShape: "50% 50% 60% 40% / 40% 60% 40% 60%",
    floatingIcons: [
      { icon: Pill,    className: "absolute top-4 left-6 w-9 h-9 opacity-20 rotate-12" },
      { icon: Shield,  className: "absolute top-14 right-10 w-7 h-7 opacity-15 -rotate-6" },
      { icon: Heart,   className: "absolute bottom-10 left-8 w-10 h-10 opacity-20 rotate-6" },
      { icon: Syringe, className: "absolute bottom-4 right-24 w-6 h-6 opacity-15 rotate-45" },
      { icon: Pill,    className: "absolute top-1/2 left-[38%] w-7 h-7 opacity-10 -rotate-12" },
    ],
  },
  alimentos: {
    title: "Alimentos Premium",
    blobColor: "bg-green-100",
    blobShape: "55% 45% 50% 50% / 50% 55% 45% 50%",
    floatingIcons: [
      { icon: Utensils,    className: "absolute top-4 left-6 w-9 h-9 opacity-20 -rotate-6" },
      { icon: Heart,       className: "absolute top-14 right-10 w-7 h-7 opacity-15 rotate-6" },
      { icon: Star,        className: "absolute bottom-10 left-8 w-10 h-10 opacity-20 rotate-12" },
      { icon: Utensils,    className: "absolute bottom-4 right-24 w-6 h-6 opacity-15 -rotate-12" },
      { icon: Gift,        className: "absolute top-1/2 left-[38%] w-7 h-7 opacity-10 rotate-6" },
    ],
  },
  alimento: {
    title: "Alimentos Premium",
    blobColor: "bg-green-100",
    blobShape: "55% 45% 50% 50% / 50% 55% 45% 50%",
    floatingIcons: [
      { icon: Utensils, className: "absolute top-4 left-6 w-9 h-9 opacity-20 -rotate-6" },
      { icon: Heart,    className: "absolute top-14 right-10 w-7 h-7 opacity-15 rotate-6" },
      { icon: Star,     className: "absolute bottom-10 left-8 w-10 h-10 opacity-20 rotate-12" },
    ],
  },
  accesorios: {
    title: "Accesorios para Mascotas",
    blobColor: "bg-pink-100",
    blobShape: "60% 40% 55% 45% / 45% 55% 45% 55%",
    floatingIcons: [
      { icon: Tag,         className: "absolute top-4 left-6 w-9 h-9 opacity-20 rotate-12" },
      { icon: ShoppingBag, className: "absolute top-14 right-10 w-7 h-7 opacity-15 -rotate-6" },
      { icon: Heart,       className: "absolute bottom-10 left-8 w-10 h-10 opacity-20 rotate-6" },
      { icon: Star,        className: "absolute bottom-4 right-24 w-6 h-6 opacity-15 rotate-45" },
      { icon: Tag,         className: "absolute top-1/2 left-[38%] w-7 h-7 opacity-10 -rotate-12" },
    ],
  },
  ofertas: {
    title: "Mejores Ofertas",
    blobColor: "bg-orange-100",
    blobShape: "45% 55% 60% 40% / 55% 45% 55% 45%",
    floatingIcons: [
      { icon: Tag,     className: "absolute top-4 left-6 w-9 h-9 opacity-20 -rotate-12" },
      { icon: Gift,    className: "absolute top-14 right-10 w-7 h-7 opacity-15 rotate-6" },
      { icon: Star,    className: "absolute bottom-10 left-8 w-10 h-10 opacity-20 -rotate-6" },
      { icon: Tag,     className: "absolute bottom-4 right-24 w-6 h-6 opacity-15 rotate-12" },
      { icon: Gift,    className: "absolute top-1/2 left-[38%] w-7 h-7 opacity-10 -rotate-12" },
    ],
  },
  todos: {
    title: "Todos los Productos",
    blobColor: "bg-violet-100",
    blobShape: "55% 45% 55% 45% / 45% 55% 45% 55%",
    floatingIcons: [
      { icon: Heart,       className: "absolute top-4 left-6 w-9 h-9 opacity-20 rotate-12" },
      { icon: ShoppingBag, className: "absolute top-14 right-10 w-7 h-7 opacity-15 -rotate-6" },
      { icon: Star,        className: "absolute bottom-10 left-8 w-10 h-10 opacity-20 rotate-6" },
      { icon: Bone,        className: "absolute bottom-4 right-24 w-6 h-6 opacity-15 -rotate-12" },
    ],
  },
};

interface CollectionBannerProps {
  slug: string;
  title: string;
  description: string;
  image: string;
  fallbackName: string;
  activeSubcategory: string | null;
  onResetSubcategory: () => void;
}

export function CollectionBanner({
  slug,
  title,
  description,
  image,
  fallbackName,
  activeSubcategory,
  onResetSubcategory,
}: CollectionBannerProps) {
  const config = BANNER_CONFIGS[slug] ?? BANNER_CONFIGS.todos;
  const displayTitle = config.title || title;

  return (
    <section className="px-4 sm:px-5 lg:px-8 2xl:px-10 py-8 md:py-14 overflow-hidden bg-background">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {activeSubcategory ? (
            <>
              <button onClick={onResetSubcategory} className="hover:text-foreground transition-colors">
                {fallbackName}
              </button>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium">{title}</span>
            </>
          ) : (
            <span className="text-foreground font-medium">{title}</span>
          )}
        </nav>

        {/* Banner grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Floating icons — positioned over the whole banner */}
          {config.floatingIcons.map(({ icon: Icon, className }, i) => (
            <Icon key={i} className={`${className} text-primary pointer-events-none select-none`} />
          ))}

          {/* Left: text */}
          <div className="relative z-10">
            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-4">
              {displayTitle}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-md">
              {description}
            </p>
            <Button size="lg" className="rounded-full font-bold uppercase tracking-widest px-8">
              Ver Productos
            </Button>
          </div>

          {/* Right: blob + image */}
          <div className="relative flex items-center justify-center h-64 md:h-[420px]">
            {config.localAsset ? (
              /* Transparent PNG floats on top of colored blob */
              <>
                <div
                  className={`absolute inset-4 md:inset-8 ${config.blobColor}`}
                  style={{ borderRadius: config.blobShape }}
                />
                <img
                  src={config.localAsset === "dogs" ? categoryDogsImg : categoryCatsImg}
                  alt={displayTitle}
                  className="relative z-10 h-full w-full object-contain drop-shadow-2xl"
                />
              </>
            ) : (
              /* Regular photo clipped to blob shape */
              <div
                className="w-full h-full overflow-hidden"
                style={{ borderRadius: config.blobShape }}
              >
                <img
                  src={image}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
