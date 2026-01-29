
# Rediseño: Sección "Comprá por" con Categorías Flotantes

## Objetivo
Transformar la sección de categorías actual (tarjetas con fotos de fondo) a un diseño minimalista donde las imágenes de mascotas "flotan" sobre el fondo blanco, con formas suaves de color pastel detrás (como en la referencia).

## Diseño Visual

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    Comprá por Categoría                     │
│                                                             │
│    ┌──────────────────┐        ┌──────────────────┐        │
│    │    ○ (blob)      │        │    ○ (blob)      │        │
│    │   🐕🐕           │        │     🐱🐱         │        │
│    │   (imagen)       │        │    (imagen)      │        │
│    │                  │        │                  │        │
│    │     Perros       │        │      Gatos       │        │
│    │  (descripción)   │        │  (descripción)   │        │
│    │   [Explorar →]   │        │   [Explorar →]   │        │
│    └──────────────────┘        └──────────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Elementos Clave

1. **Imágenes con fondo blanco**: Las fotos de perros y gatos que subiste se integran naturalmente con el fondo
2. **Blobs pastel**: Formas suaves de color violeta/rosa claro detrás de cada imagen (usando CSS con pseudo-elementos o divs con blur)
3. **Hover effects**:
   - La imagen se agranda sutilmente (scale 1.05)
   - El blob cambia de color o intensidad
   - Aparece un botón "Explorar →"
4. **Solo 2 categorías**: Perros y Gatos, centradas en la página

## Cambios Técnicos

### 1. Copiar imágenes al proyecto
- `src/assets/category-dogs.jpg` - Imagen de perros con fondo blanco
- `src/assets/category-cats.jpg` - Imagen de gatos con fondo blanco

### 2. Modificar `src/pages/Index.tsx`
- Reducir el array `categories` a solo Perros y Gatos
- Cambiar el diseño de las tarjetas:
  - Quitar el overlay oscuro y las tarjetas con aspect-ratio
  - Agregar contenedor con blob pastel detrás
  - Imagen flotante centrada
  - Texto debajo de la imagen
- Layout de 2 columnas centradas (en lugar de 4)
- Ajustar el título de la sección a "Comprá por Categoría"
- Quitar el botón "Todas las categorías" que ya no aplica

### 3. Estilos CSS del blob
Se creará usando un div con:
- `position: absolute`
- `background: hsl(var(--primary) / 0.1)` (violeta suave)
- `border-radius: 50%`
- `filter: blur(40px)`
- Transición de color en hover

## Resultado Esperado
Una sección limpia y moderna donde los animales parecen "flotar" sobre la página, con un efecto sutil de blob de color y animaciones suaves al pasar el mouse.
