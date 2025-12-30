import { Layout } from "@/components/layout/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const contactInfo = [
  {
    icon: Phone,
    title: "Teléfono",
    value: "+54 9 11 1234-5678",
    href: "tel:+5491112345678",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+54 9 11 1234-5678",
    href: "https://wa.me/5491112345678",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@farmaciaveterinaria.com",
    href: "mailto:info@farmaciaveterinaria.com",
  },
  {
    icon: MapPin,
    title: "Dirección",
    value: "Av. Ejemplo 1234, CABA, Argentina",
    href: null,
  },
  {
    icon: Clock,
    title: "Horarios",
    value: "Lunes a Sábado: 9:00 - 20:00",
    href: null,
  },
];

export default function Contacto() {
  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Contacto
            </h1>
            <p className="text-xl opacity-90">
              Estamos para ayudarte. Contactanos por el medio que prefieras.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                Información de Contacto
              </h2>
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-8 p-6 bg-success/10 rounded-xl">
                <h3 className="font-display font-bold text-foreground mb-2">
                  ¿Necesitás ayuda rápida?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Escribinos por WhatsApp y te respondemos al instante.
                </p>
                <a
                  href="https://wa.me/5491112345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-success text-success-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="h-5 w-5" />
                  Abrir WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                Envianos un Mensaje
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono (opcional)</Label>
                  <Input id="telefono" placeholder="+54 9 11 1234-5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asunto">Asunto</Label>
                  <Input id="asunto" placeholder="¿En qué podemos ayudarte?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensaje">Mensaje</Label>
                  <Textarea
                    id="mensaje"
                    placeholder="Escribí tu consulta..."
                    rows={5}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Enviar Mensaje
                </Button>
              </form>
              <p className="text-sm text-muted-foreground mt-4">
                * Este formulario es solo demostrativo. Para consultas reales, usá WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
