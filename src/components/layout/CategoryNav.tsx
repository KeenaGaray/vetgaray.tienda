import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Package } from "lucide-react";
import { fetchAllCollections } from "@/lib/shopify";
import { buildCollectionTree, CollectionNode } from "@/lib/collectionHierarchy";
import { cn } from "@/lib/utils";

// Config de blobs + imágenes fallback para subcategorías conocidas
const SUBCATEGORY_CONFIG: Record<string, { color: string; shape: string; image?: string }> = {
  default:         { color: "bg-amber-100", shape: "61% 39% 52% 48% / 44% 59% 41% 56%" },
  "perros-alimentos": { color: "bg-amber-50",  shape: "50% 50% 50% 50% / 50% 50% 50% 50%", image: "/icons/alimentos-perros.png" },
  "gatos-alimentos":  { color: "bg-violet-50", shape: "50% 50% 50% 50% / 50% 50% 50% 50%", image: "/icons/alimentos-gatos.png" },
  pipetas:         { color: "bg-sky-100",    shape: "50% 50% 60% 40% / 40% 60% 40% 60%", image: "/icons/pipetas.png" },
  antiparasitario: { color: "bg-sky-100",    shape: "50% 50% 60% 40% / 40% 60% 40% 60%", image: "/icons/pipetas.png" },
  farmacia:        { color: "bg-sky-100",    shape: "50% 50% 60% 40% / 40% 60% 40% 60%" },
  alimento:        { color: "bg-green-100",  shape: "55% 45% 50% 50% / 50% 55% 45% 50%", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&q=80" },
  alimentos:       { color: "bg-green-100",  shape: "55% 45% 50% 50% / 50% 55% 45% 50%", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&q=80" },
  perros:          { color: "bg-amber-100",  shape: "42% 58% 44% 56% / 57% 43% 57% 43%", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=80" },
  gatos:           { color: "bg-violet-100", shape: "61% 39% 52% 48% / 44% 59% 41% 56%", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80" },
  accesorios:      { color: "bg-pink-100",   shape: "60% 40% 55% 45% / 45% 55% 45% 55%" },
  ofertas:         { color: "bg-orange-100", shape: "45% 55% 60% 40% / 55% 45% 55% 45%", image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&q=80" },
  vacuna:          { color: "bg-sky-100",    shape: "50% 50% 60% 40% / 40% 60% 40% 60%" },
  vitamina:        { color: "bg-yellow-100", shape: "55% 45% 60% 40% / 40% 60% 45% 55%" },
  higiene:         { color: "bg-teal-100",   shape: "60% 40% 50% 50% / 50% 50% 55% 45%" },
  collar:          { color: "bg-pink-100",   shape: "60% 40% 55% 45% / 45% 55% 45% 55%" },
  cama:            { color: "bg-amber-100",  shape: "55% 45% 50% 50% / 50% 55% 45% 50%", image: "/icons/moises.png" },
  moises:          { color: "bg-amber-100",  shape: "55% 45% 50% 50% / 50% 55% 45% 50%", image: "/icons/moises.png" },
  juguete:         { color: "bg-red-100",    shape: "60% 40% 55% 45% / 45% 55% 45% 55%", image: "/icons/juguete.png" },
  rascador:        { color: "bg-violet-100", shape: "50% 50% 60% 40% / 40% 60% 40% 60%", image: "/icons/rascador.png" },
  ropa:            { color: "bg-purple-100", shape: "50% 50% 60% 40% / 40% 60% 40% 60%" },
};

function getBlobConfig(handle: string) {
  const h = handle.toLowerCase();
  for (const key of Object.keys(SUBCATEGORY_CONFIG)) {
    if (key !== "default" && h.includes(key)) {
      return SUBCATEGORY_CONFIG[key];
    }
  }
  return SUBCATEGORY_CONFIG.default;
}

/** Círculo con blob de color + imagen o icono encima */
function SubcatCircle({
  image,
  name,
  handle,
  active,
}: {
  image: string | null;
  name: string;
  handle: string;
  active?: boolean;
}) {
  const cfg = getBlobConfig(handle);
  // Shopify image → hardcoded fallback → icon
  const imgSrc = image || cfg.image || null;
  return (
    <div
      className={cn(
        "w-16 h-16 relative transition-all duration-200",
        active ? "scale-105" : "group-hover:scale-105"
      )}
    >
      {/* Blob de color atrás */}
      <div
        className={cn("absolute inset-0", cfg.color)}
        style={{ borderRadius: cfg.shape }}
      />
      {/* Imagen o icono encima */}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={name}
          className="relative z-10 w-full h-full object-cover"
          style={{ borderRadius: cfg.shape }}
        />
      ) : (
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <Package className="h-7 w-7 text-primary/60" />
        </div>
      )}
      {/* Borde de selección */}
      <div
        className={cn(
          "absolute inset-0 rounded-full border-2 transition-colors duration-200",
          active
            ? "border-primary"
            : "border-transparent group-hover:border-primary/50"
        )}
      />
    </div>
  );
}

export function CategoryNav() {
  const [rootCategories, setRootCategories] = useState<CollectionNode[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetchAllCollections()
      .then((all) => {
        const tree = buildCollectionTree(all);
        const roots = tree.roots.filter((n) => n.depth === 0);
        // Ofertas siempre al final
        roots.sort((a, b) => {
          if (a.handle === "ofertas") return 1;
          if (b.handle === "ofertas") return -1;
          return a.shortName.localeCompare(b.shortName);
        });
        setRootCategories(roots);
      })
      .catch(console.error);
  }, []);

  const open = (handle: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setActiveMenu(handle);
  };

  const close = () => {
    hoverTimer.current = setTimeout(() => setActiveMenu(null), 200);
  };

  const keepOpen = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const isActive = (handle: string) =>
    location.pathname === `/coleccion/${handle}` ||
    location.pathname.startsWith(`/coleccion/${handle}-`) ||
    location.pathname.startsWith(`/coleccion/${handle}/`);

  return (
    <nav className="bg-foreground relative">
      {/* Nav items — centrados */}
      <div className="px-4 sm:px-5 lg:px-8 2xl:px-10 pt-2">
        <div className="flex items-end justify-center gap-1 overflow-x-auto scrollbar-hide">
          {/* Todos */}
          <Link
            to="/coleccion/todos"
            className={cn(
              "flex-shrink-0 flex items-center px-4 lg:px-5 py-2.5 h-full text-sm font-medium transition-all whitespace-nowrap rounded-t-md",
              isActive("todos")
                ? "bg-background text-foreground"
                : "text-white/80 hover:bg-background hover:text-foreground"
            )}
          >
            Todos
          </Link>

          {rootCategories.map((cat) => (
            <div
              key={cat.handle}
              className="flex-shrink-0 relative"
              onMouseEnter={() =>
                cat.children.length > 0 ? open(cat.handle) : setActiveMenu(null)
              }
              onMouseLeave={close}
            >
              <Link
                to={`/coleccion/${cat.handle}`}
                className={cn(
                  "flex items-center gap-1 px-4 lg:px-5 py-2.5 text-sm font-medium transition-all whitespace-nowrap h-full rounded-t-md",
                  isActive(cat.handle) || activeMenu === cat.handle
                    ? "bg-background text-foreground"
                    : "text-white/80 hover:bg-background hover:text-foreground"
                )}
              >
                {cat.shortName}
                {cat.children.length > 0 && (
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-200",
                      activeMenu === cat.handle && "rotate-180"
                    )}
                  />
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Mega menu panels — span full nav width */}
      {rootCategories.map((cat) =>
        cat.children.length > 0 && activeMenu === cat.handle ? (
          <div
            key={`mega-${cat.handle}`}
            className="absolute left-0 right-0 top-full z-50 bg-white border-b border-border/50 shadow-2xl animate-in fade-in-0 slide-in-from-top-1 duration-150"
            onMouseEnter={keepOpen}
            onMouseLeave={close}
          >
            <div className="px-4 sm:px-5 lg:px-8 2xl:px-10 py-6 max-w-6xl mx-auto">
              <div className="flex justify-center items-start gap-8 overflow-x-auto py-2 scrollbar-hide">
                {/* Ver todo */}
                <Link
                  to={`/coleccion/${cat.handle}`}
                  onClick={() => setActiveMenu(null)}
                  className="flex-shrink-0 flex flex-col items-center gap-2 group w-20"
                >
                  <div className="w-16 h-16 relative group-hover:scale-105 transition-all duration-200">
                    <div
                      className="absolute inset-0 bg-primary/10"
                      style={{ borderRadius: "55% 45% 55% 45% / 45% 55% 45% 55%" }}
                    />
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <Package className="h-7 w-7 text-primary" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary/50 transition-colors duration-200" />
                  </div>
                  <span className="text-xs font-semibold text-center text-muted-foreground group-hover:text-primary w-full leading-tight">
                    Ver todo
                  </span>
                </Link>

                {cat.children.map((child) => (
                  <Link
                    key={child.handle}
                    to={`/coleccion/${child.handle}`}
                    onClick={() => setActiveMenu(null)}
                    className="flex-shrink-0 flex flex-col items-center gap-2 group w-20"
                  >
                    <SubcatCircle
                      image={child.image}
                      name={child.shortName}
                      handle={child.handle}
                    />
                    <span className="text-xs font-semibold text-center text-foreground/70 group-hover:text-primary w-full leading-tight">
                      {child.shortName}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null
      )}
    </nav>
  );
}
