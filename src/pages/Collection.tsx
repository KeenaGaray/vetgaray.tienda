import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Loader2, Package, ChevronRight } from "lucide-react";

interface Subcategory {
  name: string;
  imageUrl: string;
  query: string;
}

const subcategories: Record<string, Subcategory[]> = {
  perros: [
    { name: "Alimentos", imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&q=80", query: "alimento perro" },
    { name: "Medicamentos", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80", query: "medicamento perro" },
    { name: "Accesorios", imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&q=80", query: "accesorio perro" },
    { name: "Comederos", imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&q=80", query: "comedero perro" },
    { name: "Indumentaria", imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&q=80", query: "ropa perro" },
    { name: "Correas", imageUrl: "https://images.unsplash.com/photo-1567612529009-afe25813a308?w=200&q=80", query: "correa perro" },
  ],
  gatos: [
    { name: "Alimentos", imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&q=80", query: "alimento gato" },
    { name: "Medicamentos", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80", query: "medicamento gato" },
    { name: "Accesorios", imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&q=80", query: "accesorio gato" },
    { name: "Rascadores", imageUrl: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=200&q=80", query: "rascador gato" },
    { name: "Areneros", imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&q=80", query: "arenero gato" },
    { name: "Juguetes", imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=200&q=80", query: "juguete gato" },
  ],
  farmacia: [
    { name: "Antiparasitarios", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80", query: "antiparasitario" },
    { name: "Vitaminas", imageUrl: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200&q=80", query: "vitamina mascota" },
    { name: "Antibióticos", imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&q=80", query: "antibiotico" },
    { name: "Dermatológicos", imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&q=80", query: "dermatologico" },
    { name: "Suplementos", imageUrl: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200&q=80", query: "suplemento mascota" },
  ],
  alimentos: [
    { name: "Perros", imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=80", query: "alimento perro" },
    { name: "Gatos", imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80", query: "alimento gato" },
    { name: "Premium", imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&q=80", query: "alimento premium" },
    { name: "Medicados", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80", query: "alimento medicado" },
    { name: "Snacks", imageUrl: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=200&q=80", query: "snack mascota" },
  ],
  accesorios: [
    { name: "Camas", imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&q=80", query: "cama mascota" },
    { name: "Juguetes", imageUrl: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=200&q=80", query: "juguete mascota" },
    { name: "Transportadoras", imageUrl: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=200&q=80", query: "transportadora mascota" },
    { name: "Collares", imageUrl: "https://images.unsplash.com/photo-1567612529009-afe25813a308?w=200&q=80", query: "collar mascota" },
    { name: "Platos", imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&q=80", query: "plato mascota" },
  ],
  ofertas: [],
  todos: [],
};

const collections: Record<string, { 
  name: string; 
  query: string; 
  description: string;
  tagline: string;
  imageUrl: string;
}> = {
  perros: {
    name: "Perros",
    query: "product_type:perros OR tag:perro OR tag:perros OR title:perro*",
    description: "Todo lo que tu perro necesita: alimentos, medicamentos, accesorios y más.",
    tagline: "El mejor amigo merece lo mejor",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80",
  },
  gatos: {
    name: "Gatos",
    query: "product_type:gatos OR tag:gato OR tag:gatos OR title:gato*",
    description: "Productos especiales para el cuidado y bienestar de tu gato.",
    tagline: "Cuidado premium para felinos exigentes",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1920&q=80",
  },
  farmacia: {
    name: "Farmacia Veterinaria",
    query: "product_type:farmacia OR tag:medicamento OR tag:farmacia OR tag:veterinaria",
    description: "Medicamentos veterinarios, antiparasitarios, vitaminas y tratamientos.",
    tagline: "Salud y bienestar para tu mascota",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1920&q=80",
  },
  alimentos: {
    name: "Alimentos",
    query: "product_type:alimentos OR tag:alimento OR tag:comida OR title:alimento*",
    description: "Alimentos balanceados de las mejores marcas para perros y gatos.",
    tagline: "Nutrición de calidad para una vida saludable",
    imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1920&q=80",
  },
  accesorios: {
    name: "Accesorios",
    query: "product_type:accesorios OR tag:accesorio OR tag:juguete",
    description: "Collares, correas, camas, juguetes y todo para consentir a tu mascota.",
    tagline: "Todo para consentir a tu compañero",
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&q=80",
  },
  ofertas: {
    name: "Ofertas Especiales",
    query: "tag:oferta OR tag:descuento OR tag:promocion",
    description: "Los mejores precios en productos seleccionados. ¡Aprovechá!",
    tagline: "Los mejores precios del mercado",
    imageUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&q=80",
  },
  todos: {
    name: "Todos los Productos",
    query: "",
    description: "Explorá nuestro catálogo completo de productos para mascotas.",
    tagline: "Todo lo que tu mascota necesita en un solo lugar",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80",
  },
};

export default function Collection() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  const collection = slug ? collections[slug] : collections.todos;
  const currentSubcategories = slug ? subcategories[slug] || [] : [];

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const query = activeSubcategory 
          ? `title:*${activeSubcategory}* OR tag:${activeSubcategory}`
          : collection?.query || undefined;
        const response = await fetchProducts(24, query);
        setProducts(response.data.products.edges);
        setHasMore(response.data.products.pageInfo.hasNextPage);
        setCursor(response.data.products.pageInfo.endCursor);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [slug, collection?.query, activeSubcategory]);

  // Reset subcategory when changing collection
  useEffect(() => {
    setActiveSubcategory(null);
  }, [slug]);

  const loadMore = async () => {
    if (!cursor) return;
    try {
      const query = activeSubcategory 
        ? `title:*${activeSubcategory}* OR tag:${activeSubcategory}`
        : collection?.query || undefined;
      const response = await fetchProducts(24, query, cursor);
      setProducts((prev) => [...prev, ...response.data.products.edges]);
      setHasMore(response.data.products.pageInfo.hasNextPage);
      setCursor(response.data.products.pageInfo.endCursor);
    } catch (error) {
      console.error("Error loading more products:", error);
    }
  };

  if (!collection) {
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

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative h-48 md:h-64 overflow-hidden">
        {/* Background Image */}
        <img
          src={collection.imageUrl}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        {/* Breadcrumb */}
        <div className="absolute top-0 left-0 right-0">
          <div className="container py-4">
            <nav className="flex items-center gap-2 text-sm text-white/80">
              <Link to="/" className="hover:text-white transition-colors">
                Inicio
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white font-medium">{collection.name}</span>
            </nav>
          </div>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-xl">
              <p className="text-white/80 text-sm md:text-base font-medium mb-2 tracking-wide uppercase">
                {collection.tagline}
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white drop-shadow-lg mb-2">
                {collection.name}
              </h1>
              <p className="text-white/90 text-sm md:text-base max-w-md">
                {collection.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories */}
      {currentSubcategories.length > 0 && (
        <section className="py-6 bg-muted/30 border-b border-border">
          <div className="container">
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {/* All button */}
              <button
                onClick={() => setActiveSubcategory(null)}
                className={`flex flex-col items-center gap-2 min-w-[70px] md:min-w-[80px] group`}
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

              {currentSubcategories.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => setActiveSubcategory(sub.query)}
                  className={`flex flex-col items-center gap-2 min-w-[70px] md:min-w-[80px] group`}
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 transition-all ${
                    activeSubcategory === sub.query 
                      ? 'border-primary ring-2 ring-primary/30' 
                      : 'border-border group-hover:border-primary/50'
                  }`}>
                    <img
                      src={sub.imageUrl}
                      alt={sub.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className={`text-xs md:text-sm font-medium text-center ${
                    activeSubcategory === sub.query ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
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
                Pronto agregaremos más productos. ¡Volvé a visitarnos!
              </p>
              <Link to="/" className="text-primary hover:underline">
                Ver todos los productos
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {products.length} producto{products.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
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
