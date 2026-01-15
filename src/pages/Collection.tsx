import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { SortSelect, SortOption } from "@/components/products/SortSelect";
import { 
  fetchCollectionProducts, 
  fetchProducts, 
  fetchCollections,
  ShopifyProduct, 
  ShopifyCollection 
} from "@/lib/shopify";
import { Loader2, Package, ChevronRight } from "lucide-react";

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
    fallbackImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1920&q=80",
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
  name: string; // Nombre corto (la parte después del " - ")
  image: string | null;
}

// Función para parsear subcategorías desde las colecciones de Shopify
// Formato esperado: "Categoria - Subcategoria" o "Categoria-Subcategoria"
function parseSubcategories(
  collections: ShopifyCollection[], 
  parentHandle: string
): ParsedSubcategory[] {
  const subcategories: ParsedSubcategory[] = [];
  
  // Buscar el título de la categoría padre para matchear
  const parentCollection = collections.find(c => c.node.handle === parentHandle);
  const parentTitle = parentCollection?.node.title || parentHandle;
  
  for (const collection of collections) {
    const title = collection.node.title;
    const handle = collection.node.handle;
    
    // Ignorar la colección padre
    if (handle === parentHandle) continue;
    
    // Detectar patrones como "Alimentos - MV", "Alimentos-MV", "Farmacia - Antiparasitarios"
    // Usamos múltiples separadores: " - ", "-", " – " (guión largo)
    const separators = [' - ', ' – ', '-'];
    
    for (const sep of separators) {
      if (title.includes(sep)) {
        const parts = title.split(sep);
        if (parts.length >= 2) {
          const categoryPart = parts[0].trim().toLowerCase();
          const subcategoryName = parts.slice(1).join(sep).trim();
          
          // Verificar si la primera parte coincide con la categoría padre
          if (
            categoryPart === parentTitle.toLowerCase() ||
            categoryPart === parentHandle.toLowerCase()
          ) {
            subcategories.push({
              handle: handle,
              title: title,
              name: subcategoryName,
              image: collection.node.image?.url || null,
            });
            break; // Ya encontramos el match, no seguir con otros separadores
          }
        }
      }
    }
  }
  
  // Ordenar alfabéticamente por nombre
  return subcategories.sort((a, b) => a.name.localeCompare(b.name));
}

export default function Collection() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
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

  const mapping = slug ? COLLECTION_MAPPING[slug] : COLLECTION_MAPPING.todos;

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

  // Cargar subcategorías al cambiar de categoría
  useEffect(() => {
    async function loadSubcategories() {
      if (!mapping?.shopifyHandle) {
        setSubcategories([]);
        return;
      }
      
      try {
        const response = await fetchCollections(100);
        const allCollections = response.data.collections.edges;
        const parsed = parseSubcategories(allCollections, mapping.shopifyHandle);
        setSubcategories(parsed);
      } catch (error) {
        console.error("Error loading subcategories:", error);
        setSubcategories([]);
      }
    }
    
    loadSubcategories();
    setActiveSubcategory(null); // Reset al cambiar de categoría
  }, [slug, mapping?.shopifyHandle]);

  // Cargar productos
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        if (!mapping) {
          setProducts([]);
          return;
        }

        // Determinar qué colección cargar
        const collectionHandle = activeSubcategory || mapping.shopifyHandle;

        if (collectionHandle) {
          const response = await fetchCollectionProducts(collectionHandle, 24);
          
          if (response.data.collectionByHandle) {
            const collection = response.data.collectionByHandle;
            setProducts(collection.products.edges);
            setHasMore(collection.products.pageInfo.hasNextPage);
            setCursor(collection.products.pageInfo.endCursor);
            
            setCollectionInfo({
              title: activeSubcategory 
                ? subcategories.find(s => s.handle === activeSubcategory)?.name || collection.title
                : collection.title,
              description: collection.description || mapping.fallbackDescription,
              image: collection.image?.url || null,
            });
          } else {
            setProducts([]);
            setCollectionInfo(null);
          }
        } else {
          // "todos" - cargar todos los productos
          const response = await fetchProducts(24);
          setProducts(response.data.products.edges);
          setHasMore(response.data.products.pageInfo.hasNextPage);
          setCursor(response.data.products.pageInfo.endCursor);
          setCollectionInfo(null);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [slug, mapping, activeSubcategory, subcategories]);

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
      <section className="relative h-48 md:h-64 overflow-hidden bg-muted">
        <img
          src={displayImage}
          alt={displayTitle || mapping.fallbackName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        {/* Breadcrumb */}
        <div className="absolute top-0 left-0 right-0">
          <div className="container py-4">
            <nav className="flex items-center gap-2 text-sm text-white/80">
              <Link to="/" className="hover:text-white transition-colors">
                Inicio
              </Link>
              <ChevronRight className="h-4 w-4" />
              {activeSubcategory ? (
                <>
                  <button 
                    onClick={() => setActiveSubcategory(null)}
                    className="hover:text-white transition-colors"
                  >
                    {mapping.fallbackName}
                  </button>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-white font-medium">{displayTitle}</span>
                </>
              ) : (
                <span className="text-white font-medium">{displayTitle}</span>
              )}
            </nav>
          </div>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-xl">
              <p className="text-white/80 text-sm md:text-base font-medium mb-2 tracking-wide uppercase">
                {mapping.fallbackTagline}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white drop-shadow-lg mb-2">
                {activeSubcategory ? `${mapping.fallbackName} - ${displayTitle}` : displayTitle}
              </h1>
              <p className="text-white/90 text-sm md:text-base max-w-md">
                {displayDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories - Solo mostrar si hay subcategorías detectadas */}
      {subcategories.length > 0 && (
        <section className="py-6 bg-muted/30 border-b border-border">
          <div className="container">
            <div className="flex justify-center gap-4 md:gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {/* Botón "Todos" */}
              <button
                onClick={() => setActiveSubcategory(null)}
                className="flex flex-col items-center gap-2 min-w-[70px] md:min-w-[80px] group"
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 transition-all ${
                  activeSubcategory === null 
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-border group-hover:border-primary/50'
                }`}>
                  <div className="w-full h-full bg-primary flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <span className={`text-xs md:text-sm font-medium text-center ${
                  activeSubcategory === null ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  Todos
                </span>
              </button>

              {/* Subcategorías detectadas de Shopify */}
              {subcategories.map((sub) => (
                <button
                  key={sub.handle}
                  onClick={() => setActiveSubcategory(sub.handle)}
                  className="flex flex-col items-center gap-2 min-w-[70px] md:min-w-[80px] group"
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 transition-all ${
                    activeSubcategory === sub.handle 
                      ? 'border-primary ring-2 ring-primary/30' 
                      : 'border-border group-hover:border-primary/50'
                  }`}>
                    {sub.image ? (
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-lg font-bold text-muted-foreground">
                          {sub.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className={`text-xs md:text-sm font-medium text-center max-w-[80px] truncate ${
                    activeSubcategory === sub.handle ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  }`}>
                    {sub.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-8 pb-16">
        <div className="container">
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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

      {/* Info Box */}
      <section className="pb-16">
        <div className="container">
          <div className="bg-muted/50 rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              ¿Cómo agregar subcategorías?
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Las subcategorías se detectan automáticamente desde Shopify. Para crear una nueva:
            </p>
            <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
              <li>Andá a tu <a 
                href="https://admin.shopify.com/store/k0ib9b-b0/collections/new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >panel de Shopify → Crear colección</a></li>
              <li>Nombrala con el formato: <strong>"{mapping.fallbackName} - NombreSubcategoría"</strong></li>
              <li>Ejemplo: "{mapping.fallbackName} - Premium" o "{mapping.fallbackName} - Cachorros"</li>
              <li>Asigná productos a esa colección</li>
              <li>¡Listo! La subcategoría aparecerá automáticamente acá</li>
            </ol>
          </div>
        </div>
      </section>
    </Layout>
  );
}
