import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { CategoryNav } from "./CategoryNav";
import logoVetGaray from "@/assets/logo_vet_garay.png";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ShopifyProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const searchProducts = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetchProducts(6, `title:*${query}*`);
      setSearchResults(response.data.products.edges);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchProducts]);

  const handleProductClick = (handle: string) => {
    setShowResults(false);
    setSearchQuery("");
    navigate(`/producto/${handle}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm">
      {/* Main Header Row */}
      <div className="px-4 sm:px-5 lg:px-8 2xl:px-10">
        <div className="relative flex items-center py-3 md:py-5">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 z-10">
            <img
              src={logoVetGaray}
              alt="Vet Garay"
              className="h-9 w-9 md:h-11 md:w-11 rounded-xl object-contain"
            />
            <span className="font-sans font-extrabold text-base md:text-lg text-foreground leading-tight tracking-tight">
              Vet Garay
            </span>
          </Link>

          {/* Search Bar — only on md+, absolutely centered */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-full max-w-xl z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos, marcas y más..."
                className="pl-9 pr-4 h-10 w-full rounded-full border-2 border-border focus:border-primary bg-muted/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50">
                {searchResults.map((product) => (
                  <button
                    key={product.node.id}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                    onMouseDown={() => handleProductClick(product.node.handle)}
                  >
                    {product.node.images.edges[0] && (
                      <img
                        src={product.node.images.edges[0].node.url}
                        alt={product.node.title}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.node.title}</p>
                      <p className="text-sm text-primary font-bold">
                        ${parseFloat(product.node.priceRange.minVariantPrice.amount).toLocaleString("es-AR")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-9 w-9 rounded-full"
            >
              <User className="h-5 w-5" />
            </Button>
            <CartDrawer />
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="pb-3 md:hidden relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos, marcas y más..."
            className="pl-9 pr-4 h-10 w-full rounded-full border-2 border-border focus:border-primary bg-muted/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50">
              {searchResults.map((product) => (
                <button
                  key={product.node.id}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                  onMouseDown={() => handleProductClick(product.node.handle)}
                >
                  {product.node.images.edges[0] && (
                    <img
                      src={product.node.images.edges[0].node.url}
                      alt={product.node.title}
                      className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.node.title}</p>
                    <p className="text-sm text-primary font-bold">
                      ${parseFloat(product.node.priceRange.minVariantPrice.amount).toLocaleString("es-AR")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Nav */}
      <CategoryNav />
    </header>
  );
}
