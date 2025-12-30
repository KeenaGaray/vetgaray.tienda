import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "./CartDrawer";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Perros", href: "/coleccion/perros" },
  { name: "Gatos", href: "/coleccion/gatos" },
  { name: "Farmacia", href: "/coleccion/farmacia" },
  { name: "Alimentos", href: "/coleccion/alimentos" },
  { name: "Accesorios", href: "/coleccion/accesorios" },
  { name: "Ofertas", href: "/coleccion/ofertas" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Envíos a todo el país</span>
            <span className="sm:hidden">Envíos a todo el país</span>
          </div>
          <a 
            href="https://wa.me/5491112345678" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <span>WhatsApp: +54 9 11 1234-5678</span>
          </a>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Heart className="h-6 w-6" />
            </div>
            <span className="font-display text-xl font-bold text-foreground leading-tight">
              Vet Garay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <CartDrawer />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/" className="flex items-center gap-3 mb-6" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Heart className="h-5 w-5" />
                    </div>
                    <span className="font-display text-lg font-bold">Vet Garay</span>
                  </Link>
                  
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                        location.pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="mt-6 pt-6 border-t border-border">
                    <a
                      href="https://wa.me/5491112345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-success text-success-foreground font-medium"
                    >
                      <Phone className="h-5 w-5" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
