import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { fetchProductByHandle, formatPrice, getDiscountPercentage, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, ChevronRight, Minus, Plus, Check, Truck } from "lucide-react";
import { toast } from "sonner";

/**
 * Cleans up raw MercadoLibre descriptions:
 * - Removes lines that are only underscores (separators)
 * - Removes bare URLs / ML links
 * - Collapses excess blank lines
 */
function cleanDescription(text: string): string {
  const lines = text.split("\n");
  const cleaned = lines.filter((line) => {
    const t = line.trim();
    if (!t) return true; // keep blanks for now, collapse later
    if (/^_+$/.test(t)) return false; // _____ separators
    if (/^https?:\/\//i.test(t)) return false; // bare URLs
    if (/mercadolibre|mercadopago/i.test(t) && t.length < 80) return false;
    return true;
  });
  return cleaned.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

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
  const priceAmount = variant?.price.amount || "0";
  const hasPrice = parseFloat(priceAmount) > 0;
  const discount = hasPrice
    ? getDiscountPercentage(priceAmount, variant?.compareAtPrice?.amount)
    : null;

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
  const hasMultipleVariants =
    product.variants.edges.length > 1 &&
    product.variants.edges[0].node.title !== "Default Title";

  // Description: prefer HTML, fallback to cleaned plain text
  const descHtml = product.descriptionHtml;
  const descText = cleanDescription(product.description);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b border-border">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            {product.productType && (
              <>
                <Link
                  to={`/coleccion/${product.productType.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-foreground transition-colors capitalize"
                >
                  {product.productType}
                </Link>
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              </>
            )}
            <span className="text-foreground font-medium line-clamp-1">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product */}
      <section className="py-8 md:py-14">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">

            {/* ── LEFT: Image gallery ── */}
            <div className="space-y-3">
              {/* Main image */}
              <div className="relative bg-white rounded-2xl border border-border/60 overflow-hidden aspect-square shadow-sm">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Sin imagen
                  </div>
                )}
                {/* Image counter badge */}
                {images.length > 1 && (
                  <span className="absolute bottom-3 right-3 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
                    {selectedImage + 1} / {images.length}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 bg-white transition-all duration-150 ${
                        selectedImage === idx
                          ? "border-primary shadow-md scale-105"
                          : "border-border/60 hover:border-primary/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `Imagen ${idx + 1}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Product info ── */}
            <div className="flex flex-col">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {discount && (
                  <Badge className="bg-accent text-accent-foreground text-sm px-3 py-1">
                    -{discount}% OFF
                  </Badge>
                )}
                {product.vendor && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {product.vendor}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-display font-bold leading-tight mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                {hasPrice ? (
                  <>
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                      {formatPrice(priceAmount, variant?.price.currencyCode)}
                    </span>
                    {variant?.compareAtPrice && parseFloat(variant.compareAtPrice.amount) > 0 && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode)}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xl font-semibold text-muted-foreground italic">
                    Consultar precio
                  </span>
                )}
              </div>

              {/* Variants */}
              {hasMultipleVariants && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-foreground/80">
                    {product.options[0]?.name || "Variante"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((v) => (
                      <button
                        key={v.node.id}
                        onClick={() => setSelectedVariant(v.node.id)}
                        disabled={!v.node.availableForSale}
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
                          selectedVariant === v.node.id
                            ? "border-primary bg-primary text-primary-foreground shadow-md"
                            : v.node.availableForSale
                            ? "border-border hover:border-primary/60 bg-background"
                            : "border-border opacity-40 cursor-not-allowed line-through"
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
                <label className="block text-sm font-semibold mb-2 text-foreground/80">Cantidad</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                className="w-full mb-4 h-12 text-base font-bold rounded-xl shadow-md"
                size="lg"
                disabled={!variant?.availableForSale || !hasPrice}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {!hasPrice
                  ? "Consultar precio"
                  : variant?.availableForSale
                  ? "Agregar al carrito"
                  : "Sin stock"}
              </Button>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Producto original garantizado</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Envíos a todo el país</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Description below the grid ── */}
          {(descHtml || descText) && (
            <div className="mt-12 pt-8 border-t border-border max-w-3xl">
              <h2 className="font-display font-bold text-xl mb-4">Descripción del producto</h2>
              {descHtml && descHtml.trim() !== "<p></p>" && descHtml.trim() !== "" ? (
                <div
                  className="product-description text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: descHtml }}
                />
              ) : descText ? (
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {descText}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
