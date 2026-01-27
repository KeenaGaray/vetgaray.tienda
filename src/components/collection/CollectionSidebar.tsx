import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronRight, Loader2, Package } from "lucide-react";
import { 
  fetchCollections, 
  ShopifyCollection 
} from "@/lib/shopify";
import { 
  buildCollectionTree, 
  CollectionNode, 
  findNodeWithAncestors 
} from "@/lib/collectionHierarchy";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface CollectionSidebarProps {
  currentHandle?: string;
  activeSubcategory?: string | null;
  onSubcategorySelect?: (handle: string | null) => void;
}

function CollectionItem({ 
  node, 
  currentHandle,
  activeSubcategory,
  onSubcategorySelect,
  depth = 0,
  expandedHandles,
  toggleExpanded,
}: { 
  node: CollectionNode;
  currentHandle?: string;
  activeSubcategory?: string | null;
  onSubcategorySelect?: (handle: string | null) => void;
  depth?: number;
  expandedHandles: Set<string>;
  toggleExpanded: (handle: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedHandles.has(node.handle);
  const isActive = activeSubcategory === node.handle || 
    (!activeSubcategory && currentHandle === node.handle);
  
  const handleClick = () => {
    if (onSubcategorySelect) {
      // Si es la categoría actual (sin subcat), no hacer nada especial
      if (currentHandle === node.handle) {
        onSubcategorySelect(null);
      } else {
        onSubcategorySelect(node.handle);
      }
    }
  };

  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center gap-2 w-full rounded-lg transition-colors",
          isActive && "bg-primary/10"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren && (
          <button
            onClick={() => toggleExpanded(node.handle)}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        )}
        
        {!hasChildren && <div className="w-6" />}
        
        <button
          onClick={handleClick}
          className={cn(
            "flex-1 text-left py-2 pr-3 text-sm transition-colors rounded-r-lg",
            isActive 
              ? "text-primary font-medium" 
              : "text-foreground hover:text-primary"
          )}
        >
          {node.shortName}
        </button>
      </div>
      
      {hasChildren && (
        <Collapsible open={isExpanded}>
          <CollapsibleContent className="animate-in slide-in-from-top-1 duration-200">
            {node.children.map((child) => (
              <CollectionItem
                key={child.handle}
                node={child}
                currentHandle={currentHandle}
                activeSubcategory={activeSubcategory}
                onSubcategorySelect={onSubcategorySelect}
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

export function CollectionSidebar({ 
  currentHandle,
  activeSubcategory,
  onSubcategorySelect,
}: CollectionSidebarProps) {
  const { slug } = useParams<{ slug: string }>();
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedHandles, setExpandedHandles] = useState<Set<string>>(new Set());
  const [tree, setTree] = useState<ReturnType<typeof buildCollectionTree> | null>(null);
  
  // Cargar colecciones
  useEffect(() => {
    async function loadCollections() {
      try {
        const response = await fetchCollections(100);
        setCollections(response.data.collections.edges);
        const builtTree = buildCollectionTree(response.data.collections.edges);
        setTree(builtTree);
        
        // Auto-expandir la categoría actual y sus ancestros
        if (currentHandle) {
          const { ancestors } = findNodeWithAncestors(builtTree, currentHandle);
          const toExpand = new Set<string>();
          ancestors.forEach(a => toExpand.add(a.handle));
          toExpand.add(currentHandle);
          setExpandedHandles(toExpand);
        }
      } catch (error) {
        console.error("Error loading collections:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, [currentHandle]);
  
  // Auto-expandir cuando cambia la subcategoría activa
  useEffect(() => {
    if (activeSubcategory && tree) {
      const { ancestors } = findNodeWithAncestors(tree, activeSubcategory);
      setExpandedHandles(prev => {
        const newSet = new Set(prev);
        ancestors.forEach(a => newSet.add(a.handle));
        newSet.add(activeSubcategory);
        return newSet;
      });
    }
  }, [activeSubcategory, tree]);
  
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

  // Filtrar para mostrar solo el árbol relevante
  const getCurrentCategoryTree = (): CollectionNode[] => {
    if (!tree || !currentHandle) return [];
    
    // Buscar el nodo actual
    const currentNode = tree.flat.get(currentHandle);
    if (!currentNode) return [];
    
    // Si tiene hijos, mostrarlos
    if (currentNode.children.length > 0) {
      return currentNode.children;
    }
    
    return [];
  };

  const relevantTree = getCurrentCategoryTree();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (relevantTree.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
        <Package className="h-4 w-4 text-primary" />
        Subcategorías
      </h3>
      
      {/* Botón "Todos" */}
      <button
        onClick={() => onSubcategorySelect?.(null)}
        className={cn(
          "w-full text-left py-2 px-3 rounded-lg text-sm transition-colors mb-1",
          !activeSubcategory 
            ? "bg-primary/10 text-primary font-medium" 
            : "hover:bg-muted"
        )}
      >
        Todos
      </button>
      
      {/* Árbol de subcategorías */}
      <div className="space-y-0.5">
        {relevantTree.map((node) => (
          <CollectionItem
            key={node.handle}
            node={node}
            currentHandle={currentHandle}
            activeSubcategory={activeSubcategory}
            onSubcategorySelect={onSubcategorySelect}
            expandedHandles={expandedHandles}
            toggleExpanded={toggleExpanded}
          />
        ))}
      </div>
    </div>
  );
}
