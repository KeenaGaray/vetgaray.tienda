import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  fetchAllCollections,
  ShopifyCollection 
} from "@/lib/shopify";
import { 
  buildCollectionTree, 
  CollectionNode,
  getMainCategories 
} from "@/lib/collectionHierarchy";
import { 
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function CategoryItem({ 
  node, 
  onNavigate,
  depth = 0,
  expandedHandles,
  toggleExpanded,
}: { 
  node: CollectionNode;
  onNavigate: (handle: string) => void;
  depth?: number;
  expandedHandles: Set<string>;
  toggleExpanded: (handle: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedHandles.has(node.handle);
  
  return (
    <div className="w-full">
      <div 
        className="flex items-center gap-2 w-full hover:bg-muted transition-colors rounded-lg"
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded(node.handle);
            }}
            className="p-1.5 hover:bg-muted-foreground/10 rounded-md transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-7" />
        )}
        
        <div className="flex items-center gap-3 flex-1 py-2.5 pr-3">
          {/* Imagen o icono */}
          <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex items-center justify-center flex-shrink-0">
            {node.image ? (
              <img
                src={node.image}
                alt={node.shortName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-muted-foreground">
                {node.shortName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <button
            onClick={() => onNavigate(node.handle)}
            className="flex-1 text-left text-sm font-medium hover:text-primary transition-colors"
          >
            {node.shortName}
          </button>
          
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </div>
      
      {hasChildren && (
        <Collapsible open={isExpanded}>
          <CollapsibleContent className="animate-in slide-in-from-top-1 duration-200">
            {node.children.map((child) => (
              <CategoryItem
                key={child.handle}
                node={child}
                onNavigate={onNavigate}
                depth={depth + 1}
                expandedHandles={expandedHandles}
                toggleExpanded={toggleExpanded}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

export function CategorySidebar({ isOpen, onClose }: CategorySidebarProps) {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedHandles, setExpandedHandles] = useState<Set<string>>(new Set());
  const [tree, setTree] = useState<ReturnType<typeof buildCollectionTree> | null>(null);

  useEffect(() => {
    async function loadCollections() {
      try {
        const all = await fetchAllCollections();
        setCollections(all);
        const builtTree = buildCollectionTree(all);
        setTree(builtTree);
      } catch (error) {
        console.error("Error loading collections:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, []);

  const toggleExpanded = (handle: string) => {
    setExpandedHandles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(handle)) {
        newSet.delete(handle);
      } else {
        newSet.add(handle);
      }
      return newSet;
    });
  };

  const handleNavigate = (handle: string) => {
    onClose();
    navigate(`/coleccion/${handle}`);
  };

  const handleAllProducts = () => {
    onClose();
    navigate(`/coleccion/todos`);
  };

  // Obtener solo categorías raíz (sin " - " en el título)
  const rootCategories = tree?.roots.filter(node => node.depth === 0) || [];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sliding Panel */}
      <div 
        className={cn(
          "fixed left-4 top-32 bottom-4 z-[70] transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"
        )}
      >
        <div className="bg-card w-80 h-full rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <h2 className="font-display text-lg font-semibold">Categorías</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-muted"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Categories List */}
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
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-base">🛒</span>
                  </div>
                  <span className="flex-1 font-medium text-left text-sm">Todos los productos</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                
                {/* Categorías con jerarquía */}
                {rootCategories.map((category) => (
                  <CategoryItem
                    key={category.handle}
                    node={category}
                    onNavigate={handleNavigate}
                    expandedHandles={expandedHandles}
                    toggleExpanded={toggleExpanded}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
