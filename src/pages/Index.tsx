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
import categoryDogsImg from "@/assets/category-dogs.png";
import categoryCatsImg from "@/assets/category-cats.png";

const categories = [
  { 
    name: "Perros", 
    href: "/coleccion/perros", 
    image: categoryDogsImg,
    description: "Alimentos, medicamentos y accesorios"
  },
  { 
    name: "Gatos", 
    href: "/coleccion/gatos", 
    image: categoryCatsImg,
    description: "Todo para el cuidado felino"
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
      <section className="py-12 md:py-20 px-4 sm:px-5 lg:px-8 2xl:px-10">
        <div>
          <h2 className="font-display font-extrabold text-foreground text-center mb-12">
            Comprá por Categoría
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.href}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Blob Background */}
                <div className="absolute top-12 w-80 h-80 md:w-96 md:h-96 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110" />
                
                {/* Floating Image */}
                <div className="relative z-10 -mb-2">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-80 h-80 md:w-[26rem] md:h-[26rem] object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Text Content */}
                <h3 className="relative z-10 text-3xl md:text-4xl font-display font-bold text-foreground mb-2 uppercase tracking-wide">
                  {cat.name}
                </h3>
                
                {/* Hover Button */}
                <div className="relative z-10 flex items-center text-primary font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Explorar <ArrowRight className="ml-2 h-4 w-4" />
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
