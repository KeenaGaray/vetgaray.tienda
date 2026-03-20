import React from "react";

// Colores suaves alineados con la paleta de la app
const colors: Record<string, { bg: string; icon: string }> = {
  perros:    { bg: "bg-amber-100/80",   icon: "text-amber-600" },
  gatos:     { bg: "bg-purple-100/80",  icon: "text-purple-600" },
  farmacia:  { bg: "bg-green-100/80",   icon: "text-green-600" },
  alimento:  { bg: "bg-orange-100/80",  icon: "text-orange-500" },
  higiene:   { bg: "bg-sky-100/80",     icon: "text-sky-500" },
  antipulgas:{ bg: "bg-red-100/80",     icon: "text-red-500" },
  pipetas:   { bg: "bg-teal-100/80",    icon: "text-teal-500" },
  collares:  { bg: "bg-pink-100/80",    icon: "text-pink-500" },
  panales:   { bg: "bg-yellow-100/80",  icon: "text-yellow-600" },
  bucal:     { bg: "bg-cyan-100/80",    icon: "text-cyan-600" },
  default:   { bg: "bg-gray-100/80",    icon: "text-gray-500" },
};

const svgs: Record<string, (cls: string) => React.ReactElement> = {
  perros: (cls) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2.5c0 1.5-1 2.5-2 3L6 7l1 4H5L3 9 2 7l2-2V3l2 1h4z"/>
      <path d="M14 2.5c0 1.5 1 2.5 2 3L18 7l-1 4h2l2-2 1-2-2-2V3l-2 1h-4z"/>
      <path d="M8 11c-2 1-3 3-3 5a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4c0-2-1-4-3-5"/>
      <circle cx="9.5" cy="16" r="1" fill="currentColor" stroke="none"/>
      <circle cx="14.5" cy="16" r="1" fill="currentColor" stroke="none"/>
      <path d="M10 19c.6.6 1.4 1 2 1s1.4-.4 2-1"/>
    </svg>
  ),
  gatos: (cls) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6V3l3 3h10l3-3v3c0 5-2 9-8 10C6 15 4 11 4 6z"/>
      <path d="M9 3v2M15 3v2"/>
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none"/>
      <path d="M10 14c.5.4 1 .6 2 .6s1.5-.2 2-.6"/>
      <path d="M12 15v3M9 21l3-3 3 3"/>
    </svg>
  ),
  farmacia: (cls) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4"/>
      <path d="M12 8v8M8 12h8"/>
    </svg>
  ),
  alimento: (cls) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11h16a1 1 0 0 1 1 1v1a8 8 0 0 1-8 8 8 8 0 0 1-8-8v-1a1 1 0 0 1 1-1z"/>
      <path d="M8 11V7a2 2 0 0 1 4 0v4M14 11V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6"/>
    </svg>
  ),
  higiene: (cls) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9 6 6 9 6 13a6 6 0 0 0 12 0c0-4-3-7-6-11z"/>
      <path d="M9 13a3 3 0 0 0 6 0"/>
    </svg>
  ),
  antipulgas: (cls) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 9V5M12 19v-4M9 12H5M19 12h-4"/>
      <path d="M7 7l1.5 1.5M15.5 15.5 17 17M7 17l1.5-1.5M15.5 8.5 17 7"/>
    </svg>
  ),
  pipetas: (cls) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6v4l2 4v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6l2-4V3z"/>
      <path d="M9 11h6"/>
      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  collares: (cls) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="11" r="7"/>
      <path d="M10 14.5a2.5 2.5 0 0 0 4 0"/>
      <path d="M12 18v3"/>
      <circle cx="12" cy="22" r="1" fill="currentColor" stroke="none"/>
      <path d="M8 8.5l1 1M15 8.5l-1 1"/>
    </svg>
  ),
  panales: (cls) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/>
      <path d="M4 8c0-2 2-3 4-2l4 2 4-2c2-1 4 0 4 2"/>
      <path d="M9 13h6"/>
    </svg>
  ),
  bucal: (cls) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8 2 5 5 5 8c0 4 3 7 4 10 .4 1.2 1 2 2 2 .5 0 .8-.3 1-1l.5-2c.2-.8.5-1 1-1h1c.5 0 .8.2 1 1l.5 2c.2.7.5 1 1 1 1 0 1.6-.8 2-2 1-3 4-6 4-10 0-3-3-6-7-6z"/>
    </svg>
  ),
};

function getKey(shortName: string): string {
  const name = shortName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (name.includes("perro")) return "perros";
  if (name.includes("gato")) return "gatos";
  if (name.includes("farmacia")) return "farmacia";
  if (name.includes("alimento") || name.includes("comida")) return "alimento";
  if (name.includes("higiene")) return "higiene";
  if (name.includes("antipulga") || name.includes("pulga")) return "antipulgas";
  if (name.includes("pipeta")) return "pipetas";
  if (name.includes("collar")) return "collares";
  if (name.includes("panal") || name.includes("diaper")) return "panales";
  if (name.includes("bucal") || name.includes("dent")) return "bucal";
  return "default";
}

export function CategoryIcon({ shortName, size = "md" }: { shortName: string; size?: "sm" | "md" }) {
  const key = getKey(shortName);
  const color = colors[key] ?? colors.default;
  const renderSvg = svgs[key];
  const dim = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const iconDim = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className={`${dim} rounded-full ${color.bg} flex items-center justify-center flex-shrink-0 backdrop-blur-sm`}>
      {renderSvg ? (
        renderSvg(`${iconDim} ${color.icon}`)
      ) : (
        <span className={`text-xs font-bold ${color.icon}`}>
          {shortName.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
