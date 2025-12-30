import { Layout } from "@/components/layout/Layout";
import { RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function PoliticaDevoluciones() {
  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Política de Devoluciones
            </h1>
            <p className="text-xl opacity-90">
              Tu satisfacción es nuestra prioridad.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Quick Summary */}
            <div className="p-6 bg-success/10 rounded-xl mb-12 flex items-start gap-4">
              <RotateCcw className="h-8 w-8 text-success flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground">30 días para devoluciones</p>
                <p className="text-muted-foreground">
                  Aceptamos devoluciones dentro de los 30 días de recibido el producto, 
                  siempre que esté sin abrir y en su empaque original.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-display font-bold text-foreground">Condiciones para Devolver</h2>
              
              <div className="not-prose grid gap-4 my-6">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Producto sin abrir</p>
                    <p className="text-sm text-muted-foreground">El producto debe estar sellado y en su empaque original.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Dentro de los 30 días</p>
                    <p className="text-sm text-muted-foreground">Desde la fecha de recepción del pedido.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Comprobante de compra</p>
                    <p className="text-sm text-muted-foreground">Necesitás el ticket o factura de compra.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-display font-bold text-foreground mt-8">Productos No Devolubles</h2>
              
              <div className="not-prose grid gap-4 my-6">
                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg">
                  <XCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Medicamentos abiertos</p>
                    <p className="text-sm text-muted-foreground">Por razones sanitarias, no aceptamos medicamentos abiertos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg">
                  <XCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Alimentos abiertos</p>
                    <p className="text-sm text-muted-foreground">Bolsas o latas de alimento que hayan sido abiertas.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg">
                  <XCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Productos en oferta especial</p>
                    <p className="text-sm text-muted-foreground">Liquidaciones y ofertas especiales no tienen cambio.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-display font-bold text-foreground mt-8">Cómo Hacer una Devolución</h2>
              <ol className="text-muted-foreground space-y-2">
                <li><strong>1.</strong> Contactanos por WhatsApp indicando tu número de pedido.</li>
                <li><strong>2.</strong> Te indicaremos cómo enviar el producto de vuelta.</li>
                <li><strong>3.</strong> Una vez recibido y verificado, procesamos el reembolso.</li>
                <li><strong>4.</strong> El reembolso se acredita en 5-10 días hábiles.</li>
              </ol>

              <h2 className="text-2xl font-display font-bold text-foreground mt-8">Productos Defectuosos</h2>
              <div className="not-prose flex items-start gap-3 p-4 bg-warning/10 rounded-lg my-6">
                <AlertCircle className="h-6 w-6 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Recibiste un producto dañado?</p>
                  <p className="text-sm text-muted-foreground">
                    Contactanos dentro de las 48hs de recibido con fotos del producto y el empaque. 
                    Te enviamos uno nuevo sin costo.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 p-6 bg-primary/10 rounded-xl text-center">
              <p className="text-foreground font-semibold mb-4">
                ¿Necesitás hacer una devolución?
              </p>
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Contactanos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
