import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Truck, Shield, Clock, Heart, Dog, Cat, Pill, Package, ArrowRight, Loader2 } from "lucide-react";

const categories = [
  { name: "Perros", icon: Dog, href: "/coleccion/perros", color: "bg-amber-500" },
  { name: "Gatos", icon: Cat, href: "/coleccion/gatos", color: "bg-pink-500" },
  { name: "Farmacia", icon: Pill, href: "/coleccion/farmacia", color: "bg-primary" },
  { name: "Accesorios", icon: Package, href: "/coleccion/accesorios", color: "bg-purple-500" },
];

const features = [
  { icon: Truck, title: "Envío a todo el país", description: "Llegamos a donde estés" },
  { icon: Shield, title: "Productos originales", description: "Garantía de calidad" },
  { icon: Clock, title: "Atención personalizada", description: "Asesoramiento profesional" },
  { icon: Heart, title: "Compromiso con tu mascota", description: "Más de 10 años de experiencia" },
];

export default function Index() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetchProducts(8);
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
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              Cuidamos la salud de tu mascota
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Farmacia veterinaria de confianza con productos de calidad, medicamentos y accesorios para perros y gatos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="secondary" className="text-foreground">
                <Link to="/coleccion/farmacia">Ver Farmacia</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contacto">Contactanos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-8">
            Explorá por categoría
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.href}
                className="group flex flex-col items-center p-6 rounded-xl bg-card shadow-card hover:shadow-hover transition-all"
              >
                <div className={`${cat.color} p-4 rounded-full text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-8 w-8" />
                </div>
                <span className="font-semibold">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold">Productos destacados</h2>
            <Button asChild variant="ghost">
              <Link to="/coleccion/todos">Ver todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
