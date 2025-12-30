import { Link } from "react-router-dom";
import { ShopifyProduct, formatPrice, getDiscountPercentage } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
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
      className="group block rounded-xl bg-card shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-square bg-secondary/30 overflow-hidden">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
        {discount && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            -{discount}%
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {node.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary">
            {formatPrice(variant?.price.amount || "0", variant?.price.currencyCode)}
          </span>
          {variant?.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
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
          <ShoppingCart className="w-4 h-4 mr-2" />
          {variant?.availableForSale ? "Agregar" : "Sin stock"}
        </Button>
      </div>
    </Link>
  );
}
