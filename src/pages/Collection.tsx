import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Loader2, Dog, Cat, Pill, Utensils, Package, Tag, ChevronRight } from "lucide-react";

const collections: Record<string, { 
  name: string; 
  query: string; 
  description: string;
  icon: typeof Dog;
  color: string;
}> = {
  perros: {
    name: "Perros",
    query: "product_type:perros OR tag:perro OR tag:perros OR title:perro*",
    description: "Todo lo que tu perro necesita: alimentos, medicamentos, accesorios y más.",
    icon: Dog,
    color: "bg-amber-500",
  },
  gatos: {
    name: "Gatos",
    query: "product_type:gatos OR tag:gato OR tag:gatos OR title:gato*",
    description: "Productos especiales para el cuidado y bienestar de tu gato.",
    icon: Cat,
    color: "bg-pink-500",
  },
  farmacia: {
    name: "Farmacia",
    query: "product_type:farmacia OR tag:medicamento OR tag:farmacia OR tag:veterinaria",
    description: "Medicamentos veterinarios, antiparasitarios, vitaminas y tratamientos.",
    icon: Pill,
    color: "bg-primary",
  },
  alimentos: {
    name: "Alimentos",
    query: "product_type:alimentos OR tag:alimento OR tag:comida OR title:alimento*",
    description: "Alimentos balanceados de las mejores marcas para perros y gatos.",
    icon: Utensils,
    color: "bg-green-500",
  },
  accesorios: {
    name: "Accesorios",
    query: "product_type:accesorios OR tag:accesorio OR tag:juguete",
    description: "Collares, correas, camas, juguetes y todo para consentir a tu mascota.",
    icon: Package,
    color: "bg-purple-500",
  },
  ofertas: {
    name: "Ofertas",
    query: "tag:oferta OR tag:descuento OR tag:promocion",
    description: "Los mejores precios en productos seleccionados. ¡Aprovechá!",
    icon: Tag,
    color: "bg-accent",
  },
  todos: {
    name: "Todos los productos",
    query: "",
    description: "Explorá nuestro catálogo completo de productos para mascotas.",
    icon: Package,
    color: "bg-primary",
  },
};

export default function Collection() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);

  const collection = slug ? collections[slug] : collections.todos;

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const response = await fetchProducts(24, collection?.query || undefined);
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
  }, [slug, collection?.query]);

  const loadMore = async () => {
    if (!cursor) return;
    try {
      const response = await fetchProducts(24, collection?.query || undefined, cursor);
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

  const Icon = collection.icon;

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b border-border">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{collection.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="flex items-center gap-4 mb-4">
            <div className={`${collection.color} p-3 rounded-xl text-white`}>
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">{collection.name}</h1>
              <p className="text-muted-foreground mt-1">{collection.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-16">
        <div className="container">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-xl">
              <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
