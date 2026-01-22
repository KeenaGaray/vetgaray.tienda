import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Menu, ChevronRight, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import logoVetGaray from "@/assets/logo_vet_garay.png";
import { fetchCollections, fetchProducts, ShopifyCollection, ShopifyProduct } from "@/lib/shopify";

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
    <>
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
        {/* Top Bar */}
        <div className="bg-primary text-primary-foreground">
          <div className="container py-2 text-sm text-center">
            <span className="font-medium">Envío gratis a todo el país en compras mayores a $50.000</span>
          </div>
        </div>

        {/* Main Header */}
        <div className="container">
          <div className="flex items-center gap-4 py-4">
            {/* Sidebar Toggle - Far Left */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex-shrink-0"
              onClick={() => setCategoryMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

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
      </header>

      {/* Overlay */}
      {categoryMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300"
          onClick={() => setCategoryMenuOpen(false)}
        />
      )}

      {/* Sliding Category Panel - "Solapa" style */}
      <div 
        className={`fixed left-4 top-32 bottom-4 z-[70] transition-transform duration-300 ease-out ${
          categoryMenuOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)]'
        }`}
      >
        <div className="bg-card w-72 h-full rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <h2 className="font-display text-lg font-semibold">Categorías</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-muted"
              onClick={() => setCategoryMenuOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Categories List */}
          <div className="py-2 flex-1 overflow-y-auto">
            {loadingCategories ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleCategoryClick("todos")}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-base">🛒</span>
                  </div>
                  <span className="flex-1 font-medium text-left text-sm">Todos los productos</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                {categories.map((category) => (
                  <button
                    key={category.node.id}
                    onClick={() => handleCategoryClick(category.node.handle)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                      {category.node.image ? (
                        <img
                          src={category.node.image.url}
                          alt={category.node.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-base">📦</span>
                      )}
                    </div>
                    <span className="flex-1 font-medium text-left text-sm">{category.node.title}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
