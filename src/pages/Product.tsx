import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { fetchProductByHandle, formatPrice, getDiscountPercentage, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, ChevronRight, Minus, Plus, Check, Truck } from "lucide-react";
import { toast } from "sonner";

export default function Product() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadProduct() {
      if (!handle) return;
      setLoading(true);
      try {
        const response = await fetchProductByHandle(handle);
        const prod = response.data.productByHandle;
        setProduct(prod);
        if (prod?.variants.edges[0]) {
          setSelectedVariant(prod.variants.edges[0].node.id);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [handle]);

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Link to="/" className="text-primary hover:underline">
            Volver al inicio
          </Link>
        </div>
      </Layout>
    );
  }

  const variant = product.variants.edges.find((v) => v.node.id === selectedVariant)?.node;
  const discount = getDiscountPercentage(
    variant?.price.amount || "0",
    variant?.compareAtPrice?.amount
  );

  const handleAddToCart = () => {
    if (!variant) return;
    
    addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions,
    });
    
    toast.success("Agregado al carrito", {
      description: `${quantity}x ${product.title}`,
      position: "top-center",
    });
  };

  const images = product.images.edges;
  const hasMultipleVariants = product.variants.edges.length > 1 && product.variants.edges[0].node.title !== "Default Title";

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
            <span className="text-foreground font-medium line-clamp-1">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-secondary/30 rounded-xl overflow-hidden">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Sin imagen
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === idx ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `Imagen ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {discount && (
                <Badge className="bg-accent text-accent-foreground mb-3">
                  -{discount}% OFF
                </Badge>
              )}
              
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-4">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(variant?.price.amount || "0", variant?.price.currencyCode)}
                </span>
                {variant?.compareAtPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode)}
                  </span>
                )}
              </div>

              {/* Variants */}
              {hasMultipleVariants && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    {product.options[0]?.name || "Variante"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((v) => (
                      <button
                        key={v.node.id}
                        onClick={() => setSelectedVariant(v.node.id)}
                        disabled={!v.node.availableForSale}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedVariant === v.node.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : v.node.availableForSale
                            ? "border-border hover:border-primary"
                            : "border-border opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {v.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Cantidad</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                className="w-full mb-4"
                size="lg"
                disabled={!variant?.availableForSale}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {variant?.availableForSale ? "Agregar al carrito" : "Sin stock"}
              </Button>

              {/* Features */}
              <div className="space-y-3 pt-6 border-t border-border">
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-5 w-5 text-success" />
                  <span>Producto original garantizado</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-success" />
                  <span>Envíos a todo el país</span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h2 className="font-display font-bold text-lg mb-3">Descripción</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
