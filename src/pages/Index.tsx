import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { SortSelect, SortOption } from "@/components/products/SortSelect";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { OffersCarousel } from "@/components/home/OffersCarousel";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Truck, Shield, Clock, Heart, ArrowRight, Loader2 } from "lucide-react";

const categories = [
  { 
    name: "Perros", 
    href: "/coleccion/perros", 
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    description: "Alimentos, medicamentos y accesorios"
  },
  { 
    name: "Gatos", 
    href: "/coleccion/gatos", 
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
    description: "Todo para el cuidado felino"
  },
  { 
    name: "Farmacia", 
    href: "/coleccion/farmacia", 
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    description: "Medicamentos y tratamientos"
  },
  { 
    name: "Accesorios", 
    href: "/coleccion/accesorios", 
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80",
    description: "Juguetes, camas y más"
  },
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
  const [sortOption, setSortOption] = useState<SortOption>("alphabetical");

  // Sort products based on selected option
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
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Categories */}
      <section className="py-12 md:py-16 px-4 sm:px-5 lg:px-8 2xl:px-10">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display font-extrabold text-foreground">Comprá por</h2>
            <div className="flex bg-muted rounded-full p-1">
              <Button size="sm" className="rounded-full font-bold">Todas las categorías</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.href}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] shadow-card hover:shadow-hover transition-all"
              >
                {/* Background Image */}
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-1 drop-shadow-lg">
                    {cat.name}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base drop-shadow">
                    {cat.description}
                  </p>
                  <div className="mt-3 flex items-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver productos <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Carousel */}
      <OffersCarousel />

      {/* Products */}
      <section className="py-12 md:py-16 bg-muted/30 px-4 sm:px-5 lg:px-8 2xl:px-10">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="font-display font-extrabold text-foreground">Productos destacados</h2>
            <div className="flex items-center gap-4">
              <SortSelect value={sortOption} onChange={setSortOption} />
              <Button asChild className="font-bold">
                <Link to="/coleccion/todos">Ver todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
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
              {sortedProducts.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 px-4 sm:px-5 lg:px-8 2xl:px-10">
        <div>
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
