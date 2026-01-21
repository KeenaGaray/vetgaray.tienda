import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Menu, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CartDrawer } from "./CartDrawer";
import logoVetGaray from "@/assets/logo_vet_garay.png";
import { fetchCollections, fetchProducts, ShopifyCollection, ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

export function Header() {
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState<ShopifyCollection[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ShopifyProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Load categories from Shopify
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetchCollections(50);
        // Filter only main categories (no " - " in title)
        const mainCategories = response.data.collections.edges.filter(
          (col) => !col.node.title.includes(" - ")
        );
        setCategories(mainCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  // Search products with debounce
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

  const handleCategoryClick = (handle: string) => {
    setCategoryMenuOpen(false);
    navigate(`/coleccion/${handle}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container py-2 text-sm text-center">
          <span className="font-medium">Envío gratis a todo el país en compras mayores a $50.000</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="flex items-center justify-center gap-4 py-4">
          {/* Sidebar Toggle - Far Left */}
          <Sheet open={categoryMenuOpen} onOpenChange={setCategoryMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle className="font-display text-xl">Categorías</SheetTitle>
              </SheetHeader>
              <div className="py-2">
                {loadingCategories ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleCategoryClick("todos")}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xl">🛒</span>
                      </div>
                      <span className="flex-1 font-medium text-left">Todos los productos</span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.node.id}
                        onClick={() => handleCategoryClick(category.node.handle)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                          {category.node.image ? (
                            <img
                              src={category.node.image.url}
                              alt={category.node.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl">📦</span>
                          )}
                        </div>
                        <span className="flex-1 font-medium text-left">{category.node.title}</span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </button>
                    ))}
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logoVetGaray} alt="Vet Garay" className="h-10 w-10 md:h-12 md:w-12 rounded-xl object-contain" />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 relative max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos, marcas y más..."
                className="pl-10 pr-4 h-11 w-full rounded-full border-2 border-border focus:border-primary bg-muted/50"
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
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.node.title}</p>
                      <p className="text-sm text-primary font-bold">
                        ${parseFloat(product.node.priceRange.minVariantPrice.amount).toLocaleString('es-AR')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex flex-col items-center justify-center h-auto py-1 px-3 gap-0.5">
              <User className="h-5 w-5" />
              <span className="text-xs">Ingresar</span>
            </Button>
            <CartDrawer />
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t border-border bg-background">
        <div className="container">
          <nav className="flex items-center justify-center gap-6 py-2">
            {/* Quick Links - Centered */}
            <Link
              to="/coleccion/ofertas"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Ofertas
            </Link>
            <Link
              to="/nosotros"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors hidden md:inline-block"
            >
              Nosotros
            </Link>
            <Link
              to="/contacto"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors hidden md:inline-block"
            >
              Contacto
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
