import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchAllCollections,
  ShopifyCollection
} from "@/lib/shopify";
import {
  buildCollectionTree,
  CollectionNode,
} from "@/lib/collectionHierarchy";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/lib/categoryIcons";

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategorySidebar({ isOpen, onClose }: CategorySidebarProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState<ReturnType<typeof buildCollectionTree> | null>(null);
  const [activeCategory, setActiveCategory] = useState<CollectionNode | null>(null);
  const [flyoutTop, setFlyoutTop] = useState(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadCollections() {
      try {
        const all = await fetchAllCollections();
        setTree(buildCollectionTree(all));
      } catch (error) {
        console.error("Error loading collections:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, []);

  const handleNavigate = (handle: string) => {
    onClose();
    setActiveCategory(null);
    navigate(`/coleccion/${handle}`);
  };

  const handleAllProducts = () => {
    onClose();
    setActiveCategory(null);
    navigate(`/coleccion/todos`);
  };

  const handleCategoryEnter = (node: CollectionNode, e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (node.children.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      hoverTimer.current = setTimeout(() => {
        setFlyoutTop(rect.top);
        setActiveCategory(node);
      }, 400);
    } else {
      hoverTimer.current = setTimeout(() => setActiveCategory(null), 400);
    }
  };

  const handleCategoryLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActiveCategory(null), 300);
  };

  const handleFlyoutEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const handleFlyoutLeave = () => {
    hoverTimer.current = setTimeout(() => setActiveCategory(null), 300);
  };

  const rootCategories = tree?.roots.filter(node => node.depth === 0) || [];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300"
          onClick={() => { onClose(); setActiveCategory(null); }}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-4 top-32 bottom-4 z-[70] transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"
        )}
      >
        <div className="w-72 h-full rounded-2xl overflow-hidden flex flex-col border border-white/20 shadow-2xl backdrop-blur-xl bg-white/60">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/30 bg-white/30">
            <h2 className="font-display text-base font-semibold text-foreground/80">Categorías</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-white/40"
              onClick={() => { onClose(); setActiveCategory(null); }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Categories */}
          <div className="py-2 flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Todos los productos */}
                <button
                  onClick={handleAllProducts}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🛒</span>
                  </div>
                  <span className="flex-1 font-medium text-left text-sm">Todos los productos</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>

                {/* Categorías raíz */}
                {rootCategories.map((category) => (
                  <div
                    key={category.handle}
                    onMouseEnter={(e) => handleCategoryEnter(category, e)}
                    onMouseLeave={handleCategoryLeave}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                      activeCategory?.handle === category.handle
                        ? "bg-white/50"
                        : "hover:bg-white/40"
                    )}
                  >
                    <CategoryIcon shortName={category.shortName} />
                    <button
                      onClick={() => handleNavigate(category.handle)}
                      className="flex-1 text-left text-sm font-medium"
                    >
                      {category.shortName}
                    </button>
                    {category.children.length > 0 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Flyout subcategorías */}
      {isOpen && activeCategory && activeCategory.children.length > 0 && (
        <div
          className="fixed z-[70] transition-all duration-200"
          style={{ left: "calc(1rem + 18rem + 0.5rem)", top: flyoutTop }}
          onMouseEnter={handleFlyoutEnter}
          onMouseLeave={handleFlyoutLeave}
        >
          <div className="w-60 max-h-80 rounded-2xl overflow-hidden flex flex-col border border-white/20 shadow-2xl backdrop-blur-xl bg-white/60">
            {/* Flyout header */}
            <div className="px-4 py-3 border-b border-white/30 bg-white/30">
              <h3 className="font-display text-sm font-semibold text-foreground/70">
                {activeCategory.shortName}
              </h3>
            </div>

            {/* Subcategorías */}
            <div className="py-2 flex-1 overflow-y-auto">
              {activeCategory.children.map((child) => (
                <button
                  key={child.handle}
                  onClick={() => handleNavigate(child.handle)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/40 transition-colors text-left"
                >
                  <CategoryIcon shortName={child.shortName} size="sm" />
                  <span className="text-sm font-medium">{child.shortName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
