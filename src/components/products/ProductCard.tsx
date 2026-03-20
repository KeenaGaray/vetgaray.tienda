import { Link } from "react-router-dom";
import { ShopifyProduct, formatPrice, getDiscountPercentage } from "@/lib/shopify";
import { Tag, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const STAR_PATH = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const full = rating >= star;
        const half = !full && rating >= star - 0.5;
        return (
          <span key={star} className="relative inline-block w-3.5 h-3.5">
            <svg className="w-3.5 h-3.5 fill-gray-200" viewBox="0 0 20 20">
              <path d={STAR_PATH} />
            </svg>
            {(full || half) && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: full ? "100%" : "52%" }}>
                <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
                  <path d={STAR_PATH} />
                </svg>
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

interface ProductCardProps {
  product: ShopifyProduct;
  showStars?: boolean;
}

export function ProductCard({ product, showStars = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { node } = product;
  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const discount = getDiscountPercentage(
    variant?.price.amount || "0",
    variant?.compareAtPrice?.amount
  );
  const inStock = variant?.availableForSale ?? false;
  const hasVariant = variant?.title && variant.title !== "Default Title";
  const rating = node.id.charCodeAt(node.id.length - 2) % 3 === 0 ? 4.5 : 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant || !inStock) return;
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
      className="group flex flex-col rounded-2xl bg-white border border-gray-200 hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden"
    >
      {/* Imagen */}
      <div className="relative bg-white h-[200px] overflow-hidden">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
        )}
        {discount && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 px-4 pt-2 pb-4 gap-2">

        {/* Título */}
        <h3 className="font-semibold text-[13px] leading-snug line-clamp-2 text-gray-800 min-h-[2.4rem]">
          {node.title}
        </h3>

        {/* Estrellas — solo en home */}
        {showStars && <StarRating rating={rating} />}

        {/* Variante */}
        {hasVariant && (
          <p className="text-[11px] text-gray-400">{variant!.title}</p>
        )}

        {/* Promo badge — solo cuando hay descuento */}
        {variant?.compareAtPrice && (
          <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-2.5 py-1.5">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Tag className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-[11px] text-primary font-medium leading-tight line-clamp-2">
              Antes {formatPrice(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode)}
            </span>
          </div>
        )}

        {/* Spacer empuja precio y botón al fondo */}
        <div className="flex-1" />

        {/* Precio */}
        <p className="text-xl font-extrabold text-gray-900 tracking-tight">
          {formatPrice(variant?.price.amount || "0", variant?.price.currencyCode)}
        </p>

        {/* Botón */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`w-full flex items-center justify-center gap-1 md:gap-1.5 py-1.5 md:py-2.5 rounded-lg text-[11px] md:text-[13px] font-bold transition-all duration-200 mt-1 ${
            inStock
              ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <ShoppingCart className="w-3 h-3 md:w-3.5 md:h-3.5" />
          {inStock ? "Agregar al carrito" : "Ver producto"}
        </button>
      </div>
    </Link>
  );
}
