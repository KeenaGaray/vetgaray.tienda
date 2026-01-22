import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, ShopifyProduct, formatPrice, getDiscountPercentage } from "@/lib/shopify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Tag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export function OffersCarousel() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      try {
        // Fetch products that have offers/discounts
        const response = await fetchProducts(12, "tag:oferta OR tag:descuento OR tag:promocion");
        setProducts(response.data.products.edges);
      } catch (error) {
        console.error("Error loading offers:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  if (loading) {
    return (
      <section className="py-10 md:py-12 px-4 sm:px-5 lg:px-8 2xl:px-10">
        <div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const loopProducts = [...products, ...products];

  return (
    <section className="py-10 md:py-12 px-4 sm:px-5 lg:px-8 2xl:px-10">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-lg">
              <Tag className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold">Mejores Ofertas</h2>
              <p className="text-muted-foreground text-sm">Aprovechá los mejores descuentos</p>
            </div>
          </div>
          <Button asChild variant="ghost" className="hidden md:flex">
            <Link to="/coleccion/ofertas">Ver todas <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="marquee">
          <div className="marquee-track">
            {loopProducts.map((product, idx) => (
              <div key={`${product.node.id}-${idx}`} className="marquee-item">
                <OfferCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center md:hidden">
          <Button asChild variant="outline" size="sm">
            <Link to="/coleccion/ofertas">Ver todas las ofertas <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function OfferCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const { node } = product;
  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const discount = getDiscountPercentage(
    variant?.price.amount || "0",
    variant?.compareAtPrice?.amount
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!variant) return;
    
    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });
    
    toast.success("Agregado al carrito", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <Link
      to={`/producto/${node.handle}`}
      className="w-[180px] md:w-[200px] flex-shrink-0 group block rounded-xl bg-card shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-square bg-white overflow-hidden">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
        {discount && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground font-bold">
            -{discount}%
          </Badge>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
          {node.title}
        </h3>
        
        <div className="flex flex-col gap-1 mb-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(variant?.price.amount || "0", variant?.price.currencyCode)}
          </span>
          {variant?.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode)}
            </span>
          )}
        </div>
        
        <Button
          onClick={handleAddToCart}
          className="w-full"
          size="sm"
          disabled={!variant?.availableForSale}
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          {variant?.availableForSale ? "Agregar" : "Sin stock"}
        </Button>
      </div>
    </Link>
  );
}
