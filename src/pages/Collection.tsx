import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { SortSelect, SortOption } from "@/components/products/SortSelect";
import { CollectionBanner } from "@/components/collection/CollectionBanner";
import {
  fetchCollectionProducts,
  fetchProducts,
  fetchAllCollections,
  ShopifyProduct,
  ShopifyCollection
} from "@/lib/shopify";
import {
  buildCollectionTree,
  findNodeWithAncestors,
  CollectionNode
} from "@/lib/collectionHierarchy";
import { Loader2, Package } from "lucide-react";
import { cn } from "@/lib/utils";

// Blob config + imagen fallback para subcategorías conocidas
const SUBCATEGORY_CONFIG: Record<string, { color: string; shape: string; image?: string }> = {
  default:         { color: "bg-amber-100", shape: "61% 39% 52% 48% / 44% 59% 41% 56%" },
  // Específicos primero (matchean antes que los genéricos)
  "perros-alimentos": { color: "bg-amber-50",  shape: "50% 50% 50% 50% / 50% 50% 50% 50%", image: "/icons/alimentos-perros.png" },
  "gatos-alimentos":  { color: "bg-violet-50", shape: "50% 50% 50% 50% / 50% 50% 50% 50%", image: "/icons/alimentos-gatos.png" },
  // Genéricos
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

// Mapeo de slugs de la web a handles de colecciones en Shopify
const COLLECTION_MAPPING: Record<string, {
  shopifyHandle: string;
  fallbackName: string;
  fallbackDescription: string;
  fallbackTagline: string;
  fallbackImage: string;
}> = {
  farmacia: {
    shopifyHandle: "farmacia",
    fallbackName: "Farmacia Veterinaria",
    fallbackDescription: "Medicamentos veterinarios, antiparasitarios, vitaminas y tratamientos.",
    fallbackTagline: "Salud y bienestar para tu mascota",
    fallbackImage: "https://i.pinimg.com/736x/d4/a9/7c/d4a97c378fbafbd830250ec385c37a10.jpg",
  },
  alimento: {
    shopifyHandle: "alimento",
    fallbackName: "Alimentos",
    fallbackDescription: "Alimentos balanceados de las mejores marcas para perros y gatos.",
    fallbackTagline: "Nutrición de calidad para una vida saludable",
    fallbackImage: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1920&q=80",
  },
  alimentos: {
    shopifyHandle: "alimento",
    fallbackName: "Alimentos",
    fallbackDescription: "Alimentos balanceados de las mejores marcas para perros y gatos.",
    fallbackTagline: "Nutrición de calidad para una vida saludable",
    fallbackImage: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1920&q=80",
  },
  gatos: {
    shopifyHandle: "gatos",
    fallbackName: "Gatos",
    fallbackDescription: "Productos especiales para el cuidado y bienestar de tu gato.",
    fallbackTagline: "Cuidado premium para felinos exigentes",
    fallbackImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1920&q=80",
  },
  perros: {
    shopifyHandle: "perros",
    fallbackName: "Perros",
    fallbackDescription: "Todo lo que tu perro necesita: alimentos, medicamentos, accesorios y más.",
    fallbackTagline: "El mejor amigo merece lo mejor",
    fallbackImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80",
  },
  accesorios: {
    shopifyHandle: "accesorios",
    fallbackName: "Accesorios",
    fallbackDescription: "Collares, correas, camas, juguetes y todo para consentir a tu mascota.",
    fallbackTagline: "Todo para consentir a tu compañero",
    fallbackImage: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&q=80",
  },
  ofertas: {
    shopifyHandle: "ofertas",
    fallbackName: "Ofertas Especiales",
    fallbackDescription: "Los mejores precios en productos seleccionados. ¡Aprovechá!",
    fallbackTagline: "Los mejores precios del mercado",
    fallbackImage: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&q=80",
  },
  todos: {
    shopifyHandle: "",
    fallbackName: "Todos los Productos",
    fallbackDescription: "Explorá nuestro catálogo completo de productos para mascotas.",
    fallbackTagline: "Todo lo que tu mascota necesita en un solo lugar",
    fallbackImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80",
  },
};

interface ParsedSubcategory {
  handle: string;
  title: string;
  name: string;
  image: string | null;
  children: ParsedSubcategory[];
}

// Función para obtener subcategorías usando el nuevo sistema jerárquico
function getSubcategoriesFromTree(
  collections: ShopifyCollection[], 
  parentHandle: string
): ParsedSubcategory[] {
  const tree = buildCollectionTree(collections);
  const parent = tree.flat.get(parentHandle);
  
  if (!parent) return [];
  
  const mapNodeToSubcategory = (node: CollectionNode): ParsedSubcategory => ({
    handle: node.handle,
    title: node.title,
    name: node.shortName,
    image: node.image,
    children: node.children.map(mapNodeToSubcategory),
  });
  
  return parent.children.map(mapNodeToSubcategory);
}

export default function Collection() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [allCollections, setAllCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("alphabetical");
  const [collectionInfo, setCollectionInfo] = useState<{
    title: string;
    description: string;
    image: string | null;
  } | null>(null);
  
  // Subcategorías detectadas automáticamente
  const [subcategories, setSubcategories] = useState<ParsedSubcategory[]>([]);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  // Si el slug está en el mapping, usarlo; si no, construir un mapping dinámico con el slug como handle
  const mapping = slug
    ? (COLLECTION_MAPPING[slug] ?? {
        shopifyHandle: slug,
        fallbackName: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        fallbackDescription: "",
        fallbackTagline: "",
        fallbackImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80",
      })
    : COLLECTION_MAPPING.todos;

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortOption) {
      case "alphabetical":
        return sorted.sort((a, b) => a.node.title.localeCompare(b.node.title));
      case "price-asc":
        return sorted.sort((a, b) => 
          parseFloat(a.node.priceRange.minVariantPrice.amount) - 
          parseFloat(b.node.priceRange.minVariantPrice.amount)
        );
      case "price-desc":
        return sorted.sort((a, b) => 
          parseFloat(b.node.priceRange.minVariantPrice.amount) - 
          parseFloat(a.node.priceRange.minVariantPrice.amount)
        );
      case "relevant":
      default:
        return sorted;
    }
  }, [products, sortOption]);

  // Cargar subcategorías + productos en paralelo al cambiar de categoría
  useEffect(() => {
    if (!mapping) return;
    setActiveSubcategory(null);
    setLoading(true);

    const collectionHandle = mapping.shopifyHandle;

    const subcatPromise = collectionHandle
      ? fetchAllCollections().then((collections) => {
          setAllCollections(collections);
          setSubcategories(getSubcategoriesFromTree(collections, collectionHandle));
        }).catch(() => setSubcategories([]))
      : Promise.resolve(setSubcategories([]));

    const productsPromise = collectionHandle
      ? fetchCollectionProducts(collectionHandle, 24).then((response) => {
          if (response.data.collectionByHandle) {
            const col = response.data.collectionByHandle;
            setProducts(col.products.edges);
            setHasMore(col.products.pageInfo.hasNextPage);
            setCursor(col.products.pageInfo.endCursor);
            setCollectionInfo({
              title: col.title,
              description: col.description || mapping.fallbackDescription,
              image: col.image?.url || null,
            });
          } else {
            setProducts([]);
            setCollectionInfo(null);
          }
        })
      : fetchProducts(24).then((response) => {
          setProducts(response.data.products.edges);
          setHasMore(response.data.products.pageInfo.hasNextPage);
          setCursor(response.data.products.pageInfo.endCursor);
          setCollectionInfo(null);
        });

    Promise.all([subcatPromise, productsPromise])
      .catch((err) => { console.error(err); setProducts([]); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, mapping?.shopifyHandle]);

  // Recargar productos al cambiar subcategoría activa
  useEffect(() => {
    if (activeSubcategory === null) return;
    setLoading(true);
    fetchCollectionProducts(activeSubcategory, 24)
      .then((response) => {
        if (response.data.collectionByHandle) {
          const col = response.data.collectionByHandle;
          setProducts(col.products.edges);
          setHasMore(col.products.pageInfo.hasNextPage);
          setCursor(col.products.pageInfo.endCursor);
        } else {
          setProducts([]);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeSubcategory]);

  const loadMore = async () => {
    if (!cursor || !mapping) return;
    const collectionHandle = activeSubcategory || mapping.shopifyHandle;
    
    try {
      if (collectionHandle) {
        const response = await fetchCollectionProducts(collectionHandle, 24, cursor);
        if (response.data.collectionByHandle) {
          setProducts((prev) => [...prev, ...response.data.collectionByHandle!.products.edges]);
          setHasMore(response.data.collectionByHandle.products.pageInfo.hasNextPage);
          setCursor(response.data.collectionByHandle.products.pageInfo.endCursor);
        }
      } else {
        const response = await fetchProducts(24, undefined, cursor);
        setProducts((prev) => [...prev, ...response.data.products.edges]);
        setHasMore(response.data.products.pageInfo.hasNextPage);
        setCursor(response.data.products.pageInfo.endCursor);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    }
  };

  if (!mapping) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Colección no encontrada</h1>
          <Link to="/" className="text-primary hover:underline">
            Volver al inicio
          </Link>
        </div>
      </Layout>
    );
  }

  const displayTitle = activeSubcategory 
    ? subcategories.find(s => s.handle === activeSubcategory)?.name || collectionInfo?.title 
    : (collectionInfo?.title || mapping.fallbackName);
  const displayDescription = collectionInfo?.description || mapping.fallbackDescription;
  const displayImage = collectionInfo?.image || mapping.fallbackImage;

  return (
    <Layout>
      {/* Hero Banner */}
      <CollectionBanner
        slug={slug ?? "todos"}
        title={activeSubcategory ? `${mapping.fallbackName} — ${displayTitle}` : (displayTitle ?? mapping.fallbackName)}
        description={displayDescription}
        image={displayImage}
        fallbackName={mapping.fallbackName}
        activeSubcategory={activeSubcategory}
        onResetSubcategory={() => setActiveSubcategory(null)}
      />

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <section className="bg-background border-b border-border/40 px-4 sm:px-5 lg:px-8 2xl:px-10 py-5">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center items-start gap-8 overflow-x-auto py-2 scrollbar-hide">
              {/* Todos */}
              <button
                onClick={() => setActiveSubcategory(null)}
                className="flex-shrink-0 flex flex-col items-center gap-2 group w-20"
              >
                <div className={cn(
                  "w-16 h-16 relative transition-all duration-200",
                  activeSubcategory === null ? "scale-105" : "group-hover:scale-105"
                )}>
                  <div
                    className="absolute inset-0 bg-primary/10"
                    style={{ borderRadius: "55% 45% 55% 45% / 45% 55% 45% 55%" }}
                  />
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <Package className="h-7 w-7 text-primary" />
                  </div>
                  <div className={cn(
                    "absolute inset-0 rounded-full border-2 transition-colors duration-200",
                    activeSubcategory === null
                      ? "border-primary shadow-md shadow-primary/20"
                      : "border-transparent group-hover:border-primary/50"
                  )} />
                </div>
                <span className={cn(
                  "text-xs font-semibold text-center leading-tight",
                  activeSubcategory === null ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  Todos
                </span>
              </button>

              {/* Subcategorías */}
              {subcategories.map((sub) => {
                const cfg = getBlobConfig(sub.handle);
                const isSelected = activeSubcategory === sub.handle;
                // Usar imagen de Shopify → fallback hardcodeado → icono
                const imgSrc = sub.image || cfg.image || null;
                return (
                  <button
                    key={sub.handle}
                    onClick={() => setActiveSubcategory(sub.handle)}
                    className="flex-shrink-0 flex flex-col items-center gap-2 group w-20"
                  >
                    <div className={cn(
                      "w-16 h-16 relative transition-all duration-200",
                      isSelected ? "scale-105" : "group-hover:scale-105"
                    )}>
                      {/* Blob de color atrás */}
                      <div
                        className={cn("absolute inset-0", cfg.color)}
                        style={{ borderRadius: cfg.shape }}
                      />
                      {/* Imagen encima */}
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={sub.name}
                          className="relative z-10 w-full h-full object-cover"
                          style={{ borderRadius: cfg.shape }}
                        />
                      ) : (
                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                          <Package className="h-7 w-7 text-primary/60" />
                        </div>
                      )}
                      {/* Borde de selección */}
                      <div className={cn(
                        "absolute inset-0 rounded-full border-2 transition-colors duration-200",
                        isSelected
                          ? "border-primary shadow-md shadow-primary/20"
                          : "border-transparent group-hover:border-primary/50"
                      )} />
                    </div>
                    <span className={cn(
                      "text-xs font-semibold text-center leading-tight w-full",
                      isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {sub.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-8 pb-16 px-4 sm:px-5 lg:px-8 2xl:px-10">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-xl">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No hay productos en esta categoría</h2>
              <p className="text-muted-foreground mb-4">
                Asegurate de que tu colección "<strong>{activeSubcategory || mapping.shopifyHandle || 'todos'}</strong>" exista en Shopify
                y tenga productos asignados.
              </p>
              <Link to="/" className="text-primary hover:underline">
                Ver todos los productos
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  {sortedProducts.length} producto{sortedProducts.length !== 1 ? "s" : ""}
                </p>
                <SortSelect value={sortOption} onChange={setSortOption} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.node.id} product={product} />
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Cargar más productos
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

    </Layout>
  );
}
