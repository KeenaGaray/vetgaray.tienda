import { ShopifyCollection } from "./shopify";

export interface CollectionNode {
  handle: string;
  title: string;
  shortName: string;
  fullPath: string[];
  image: string | null;
  children: CollectionNode[];
  depth: number;
}

export interface CollectionTree {
  roots: CollectionNode[];
  flat: Map<string, CollectionNode>;
}

/**
 * Parsea las colecciones de Shopify y construye un árbol jerárquico
 * basado en el formato "Categoria - Subcategoria - SubSubcategoria"
 */
export function buildCollectionTree(collections: ShopifyCollection[]): CollectionTree {
  const flat = new Map<string, CollectionNode>();
  const roots: CollectionNode[] = [];
  
  // Separadores válidos
  const SEPARATOR = " - ";
  
  // Primero, crear todos los nodos
  for (const col of collections) {
    const title = col.node.title;
    const parts = title.split(SEPARATOR).map(p => p.trim());
    
    const node: CollectionNode = {
      handle: col.node.handle,
      title: title,
      shortName: parts[parts.length - 1], // Último elemento es el nombre corto
      fullPath: parts,
      image: col.node.image?.url || null,
      children: [],
      depth: parts.length - 1,
    };
    
    flat.set(col.node.handle, node);
  }
  
  // Segundo paso: establecer relaciones padre-hijo
  for (const [, node] of flat) {
    if (node.fullPath.length === 1) {
      // Es una categoría raíz
      roots.push(node);
    } else {
      // Buscar padre
      const parentPath = node.fullPath.slice(0, -1);
      const parentTitle = parentPath.join(SEPARATOR);
      
      // Buscar la colección padre por título
      let parent: CollectionNode | undefined;
      for (const [, potentialParent] of flat) {
        if (potentialParent.title === parentTitle) {
          parent = potentialParent;
          break;
        }
      }
      
      if (parent) {
        parent.children.push(node);
      } else {
        // Si no encuentra padre, es una raíz (puede que el padre no exista como colección)
        // Crear un nodo virtual o agregarlo como raíz
        roots.push(node);
      }
    }
  }
  
  // Ordenar hijos alfabéticamente
  const sortChildren = (nodes: CollectionNode[]) => {
    nodes.sort((a, b) => a.shortName.localeCompare(b.shortName));
    for (const node of nodes) {
      if (node.children.length > 0) {
        sortChildren(node.children);
      }
    }
  };
  
  sortChildren(roots);
  roots.sort((a, b) => a.shortName.localeCompare(b.shortName));
  
  return { roots, flat };
}

/**
 * Encuentra un nodo y sus ancestros por handle
 */
export function findNodeWithAncestors(
  tree: CollectionTree, 
  handle: string
): { node: CollectionNode | null; ancestors: CollectionNode[] } {
  const node = tree.flat.get(handle);
  if (!node) return { node: null, ancestors: [] };
  
  const ancestors: CollectionNode[] = [];
  
  // Reconstruir ancestros desde el path
  for (let i = 1; i < node.fullPath.length; i++) {
    const ancestorTitle = node.fullPath.slice(0, i).join(" - ");
    for (const [, potentialAncestor] of tree.flat) {
      if (potentialAncestor.title === ancestorTitle) {
        ancestors.push(potentialAncestor);
        break;
      }
    }
  }
  
  return { node, ancestors };
}

/**
 * Obtiene todas las subcategorías directas de una colección
 */
export function getDirectChildren(
  collections: ShopifyCollection[],
  parentHandle: string
): CollectionNode[] {
  const tree = buildCollectionTree(collections);
  const parent = tree.flat.get(parentHandle);
  
  if (parent) {
    return parent.children;
  }
  
  // Si el handle no existe, buscar por coincidencia de nombre
  for (const [, node] of tree.flat) {
    if (node.shortName.toLowerCase() === parentHandle.toLowerCase()) {
      return node.children;
    }
  }
  
  return [];
}

/**
 * Obtiene el árbol de descendientes de una colección
 */
export function getDescendantTree(
  collections: ShopifyCollection[],
  parentHandle: string
): CollectionNode[] {
  const tree = buildCollectionTree(collections);
  const parent = tree.flat.get(parentHandle);
  
  if (parent) {
    return parent.children;
  }
  
  return [];
}

/**
 * Determina si una colección es una categoría principal (sin separadores)
 */
export function isMainCategory(title: string): boolean {
  return !title.includes(" - ");
}

/**
 * Obtiene solo las categorías principales (sin subcategorías)
 */
export function getMainCategories(collections: ShopifyCollection[]): ShopifyCollection[] {
  return collections.filter(col => isMainCategory(col.node.title));
}
