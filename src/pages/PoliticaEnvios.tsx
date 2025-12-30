import { Layout } from "@/components/layout/Layout";
import { Truck, Clock, MapPin, Package } from "lucide-react";

export default function PoliticaEnvios() {
  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Política de Envíos
            </h1>
            <p className="text-xl opacity-90">
              Toda la información sobre cómo recibís tus productos.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Truck className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Envío gratis</p>
                  <p className="text-sm text-muted-foreground">En compras mayores a $50.000</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Clock className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Tiempo de entrega</p>
                  <p className="text-sm text-muted-foreground">3 a 7 días hábiles</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-display font-bold text-foreground">Zonas de Envío</h2>
              <p className="text-muted-foreground">
                Realizamos envíos a todo el país a través de servicios de correo y mensajería confiables.
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li><strong>CABA y GBA:</strong> Entrega en 24-48 horas hábiles.</li>
                <li><strong>Interior del país:</strong> Entrega en 3-7 días hábiles.</li>
                <li><strong>Zonas alejadas:</strong> Puede demorar hasta 10 días hábiles.</li>
              </ul>

              <h2 className="text-2xl font-display font-bold text-foreground mt-8">Costos de Envío</h2>
              <p className="text-muted-foreground">
                El costo de envío se calcula automáticamente al momento del checkout según tu ubicación.
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li>Compras mayores a <strong>$50.000</strong>: Envío gratis a todo el país.</li>
                <li>Compras menores: Costo según distancia y peso del paquete.</li>
              </ul>

              <h2 className="text-2xl font-display font-bold text-foreground mt-8">Seguimiento del Pedido</h2>
              <p className="text-muted-foreground">
                Una vez despachado tu pedido, recibirás un email con el número de seguimiento para 
                rastrear tu envío en tiempo real.
              </p>

              <h2 className="text-2xl font-display font-bold text-foreground mt-8">Retiro en Sucursal</h2>
              <p className="text-muted-foreground">
                También podés retirar tu pedido en nuestra sucursal sin costo adicional. 
                Te avisaremos por email cuando esté listo para retirar.
              </p>

              <h2 className="text-2xl font-display font-bold text-foreground mt-8">Problemas con el Envío</h2>
              <p className="text-muted-foreground">
                Si tenés algún problema con tu envío (demoras, daños, extravío), contactanos 
                inmediatamente por WhatsApp y lo solucionamos.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-12 p-6 bg-primary/10 rounded-xl text-center">
              <p className="text-foreground font-semibold mb-4">
                ¿Tenés dudas sobre tu envío?
              </p>
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Consultanos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
