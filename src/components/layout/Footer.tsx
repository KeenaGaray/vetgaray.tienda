import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import logoVetGaray from "@/assets/logo_vet_garay.png";

const footerLinks = {
  productos: [
    { name: "Perros", href: "/coleccion/perros" },
    { name: "Gatos", href: "/coleccion/gatos" },
    { name: "Farmacia", href: "/coleccion/farmacia" },
    { name: "Alimentos", href: "/coleccion/alimentos" },
    { name: "Accesorios", href: "/coleccion/accesorios" },
  ],
  informacion: [
    { name: "Nosotros", href: "/nosotros" },
    { name: "Contacto", href: "/contacto" },
    { name: "Política de Envíos", href: "/politica-envios" },
    { name: "Política de Devoluciones", href: "/politica-devoluciones" },
    { name: "Términos y Condiciones", href: "/terminos" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logoVetGaray} alt="Vet Garay" className="h-12 w-12 rounded-xl object-contain" />
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold leading-tight">
                  Vet Garay
                </span>
                <span className="text-xs text-primary font-medium">Farmacia Veterinaria</span>
              </div>
            </Link>
            <p className="text-background/70 text-sm mb-4">
              Tu farmacia veterinaria de confianza. Cuidamos la salud de tus mascotas con productos de calidad y asesoramiento profesional.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/veterinariagaray"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 hover:bg-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/vetgaray"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 hover:bg-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Productos</h4>
            <ul className="space-y-2">
              {footerLinks.productos.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Información</h4>
            <ul className="space-y-2">
              {footerLinks.informacion.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/5491126306326"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors"
                >
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <span>+54 9 11 2630-6326</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Juan de Garay 2575, Olivos, Argentina</span>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>Lun - Vie: 9:00 - 20:00</span>
                  <span>Sáb y feriados: 10:00 - 14:00</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-background/50">
          <p>© 2024 Vet Garay. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <img src="https://www.mercadopago.com/org-img/Manual/ManualMP/badges/2.0/badge_large.png" alt="Mercado Pago" className="h-8 opacity-70" />
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/5491126306326"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </footer>
  );
}
