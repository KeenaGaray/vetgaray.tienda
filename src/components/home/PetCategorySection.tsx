import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Fish, Gamepad2, Moon, ShoppingBag, Bone, Utensils, Scissors, Heart } from "lucide-react";
import categoryDogsImg from "@/assets/category-dogs.png";
import categoryCatsImg from "@/assets/category-cats.png";

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden>
      <ellipse cx="16" cy="10" rx="5" ry="7" />
      <ellipse cx="30" cy="6" rx="5" ry="7" />
      <ellipse cx="44" cy="10" rx="5" ry="7" />
      <ellipse cx="56" cy="20" rx="5" ry="7" transform="rotate(30 56 20)" />
      <ellipse cx="8" cy="20" rx="5" ry="7" transform="rotate(-30 8 20)" />
      <path d="M32 20c-12 0-20 8-20 18 0 8 6 14 12 14h16c6 0 12-6 12-14 0-10-8-18-20-18z" />
    </svg>
  );
}

const catFeatures = [
  { icon: Fish,       label: "Alimento Seco" },
  { icon: Gamepad2,   label: "Juguetes" },
  { icon: Moon,       label: "Camas" },
  { icon: ShoppingBag, label: "Accesorios" },
];

const dogFeatures = [
  { icon: Utensils,   label: "Alimento Balanceado" },
  { icon: Bone,       label: "Juguetes" },
  { icon: Scissors,   label: "Higiene y Grooming" },
  { icon: Heart,      label: "Salud y Bienestar" },
];

export function PetCategorySection() {
  return (
    <section className="py-16 md:py-28 px-4 sm:px-5 lg:px-8 2xl:px-10 overflow-hidden">

      {/* ── GATOS ── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-20 md:mb-32">

        {/* Texto */}
        <div className="flex flex-col">
          <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-3">
            Nuestra Tienda
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4 leading-tight">
            Todo para tu Gato
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
            Todo lo que tu gato necesita en un solo lugar. Alimentos premium, juguetes, accesorios y productos de salud para el mejor cuidado felino.
          </p>

          {/* Features 2×2 */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-10">
            {catFeatures.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>

          <div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-border text-foreground hover:bg-muted hover:border-primary/40 transition-colors"
            >
              <Link to="/coleccion/gatos">Ver todos los productos</Link>
            </Button>
          </div>
        </div>

        {/* Imagen con blob */}
        <Link
          to="/coleccion/gatos"
          className="relative flex items-center justify-center h-80 md:h-[420px] group/img"
        >
          {/* Blob violeta */}
          <div
            className="absolute inset-4 md:inset-8 bg-violet-100 transition-transform duration-500 group-hover/img:scale-105"
            style={{ borderRadius: "61% 39% 52% 48% / 44% 59% 41% 56%" }}
          />
          {/* Patitas decorativas */}
          <PawIcon className="absolute top-6 right-8 w-8 h-8 text-violet-300/60" />
          <PawIcon className="absolute top-14 right-20 w-5 h-5 text-violet-300/40" />
          {/* Imagen del gato */}
          <img
            src={categoryCatsImg}
            alt="Tienda de gatos"
            className="relative z-10 h-full w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover/img:scale-105"
          />
        </Link>
      </div>

      {/* ── PERROS ── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

        {/* Imagen con blob */}
        <Link
          to="/coleccion/perros"
          className="relative flex items-center justify-center h-80 md:h-[420px] order-2 md:order-1 group/img"
        >
          {/* Blob durazno */}
          <div
            className="absolute inset-4 md:inset-8 bg-amber-100 transition-transform duration-500 group-hover/img:scale-105"
            style={{ borderRadius: "42% 58% 44% 56% / 57% 43% 57% 43%" }}
          />
          {/* Patitas decorativas */}
          <PawIcon className="absolute bottom-8 left-8 w-8 h-8 text-amber-300/60" />
          <PawIcon className="absolute bottom-16 left-20 w-5 h-5 text-amber-300/40" />
          {/* Imagen del perro */}
          <img
            src={categoryDogsImg}
            alt="Tienda de perros"
            className="relative z-10 h-full w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover/img:scale-105"
          />
        </Link>

        {/* Texto */}
        <div className="flex flex-col order-1 md:order-2">
          <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-3">
            Nuestra Tienda
          </p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4 leading-tight">
            Lo mejor para tu Perro
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
            Todo lo que tu perro necesita en un solo lugar. Alimentos balanceados, juguetes, accesorios y productos de salud para su bienestar diario.
          </p>

          {/* Features 2×2 */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-10">
            {dogFeatures.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>

          <div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-border text-foreground hover:bg-muted hover:border-primary/40 transition-colors"
            >
              <Link to="/coleccion/perros">Ver todos los productos</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
