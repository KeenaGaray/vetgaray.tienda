import { Layout } from "@/components/layout/Layout";

export default function Terminos() {
  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-xl opacity-90">
              Condiciones de uso de nuestro sitio y servicios.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-muted-foreground text-sm">
              Última actualización: Enero 2024
            </p>

            <h2 className="text-2xl font-display font-bold text-foreground mt-8">1. Información General</h2>
            <p className="text-muted-foreground">
              Estos términos y condiciones regulan el uso del sitio web de Farmacia Veterinaria Garay 
              y la compra de productos a través del mismo. Al utilizar nuestro sitio, aceptás estos términos.
            </p>

            <h2 className="text-2xl font-display font-bold text-foreground mt-8">2. Productos y Precios</h2>
            <p className="text-muted-foreground">
              Nos esforzamos por mantener la información de productos actualizada. Sin embargo, 
              nos reservamos el derecho de corregir errores en descripciones o precios. Los precios 
              pueden cambiar sin previo aviso.
            </p>
            <ul className="text-muted-foreground space-y-2">
              <li>Los precios mostrados incluyen IVA.</li>
              <li>Las imágenes son ilustrativas y pueden variar.</li>
              <li>La disponibilidad está sujeta a stock.</li>
            </ul>

            <h2 className="text-2xl font-display font-bold text-foreground mt-8">3. Proceso de Compra</h2>
            <p className="text-muted-foreground">
              Al realizar una compra, estás realizando una oferta de compra que está sujeta a 
              confirmación de nuestra parte. Nos reservamos el derecho de rechazar pedidos en 
              caso de error en precios, falta de stock u otros motivos.
            </p>

            <h2 className="text-2xl font-display font-bold text-foreground mt-8">4. Medios de Pago</h2>
            <p className="text-muted-foreground">
              Aceptamos los medios de pago habilitados en nuestra plataforma de checkout. 
              El procesamiento de pagos es realizado por terceros y está sujeto a sus términos.
            </p>

            <h2 className="text-2xl font-display font-bold text-foreground mt-8">5. Envíos</h2>
            <p className="text-muted-foreground">
              Los plazos de entrega son estimados y pueden variar según la zona y disponibilidad 
              del servicio de correo. No nos responsabilizamos por demoras causadas por el servicio 
              de correo o por información incorrecta proporcionada por el comprador.
            </p>

            <h2 className="text-2xl font-display font-bold text-foreground mt-8">6. Devoluciones</h2>
            <p className="text-muted-foreground">
              Las devoluciones se rigen por nuestra Política de Devoluciones. Consultala para 
              conocer las condiciones y procedimientos.
            </p>

            <h2 className="text-2xl font-display font-bold text-foreground mt-8">7. Privacidad</h2>
            <p className="text-muted-foreground">
              Respetamos tu privacidad. Los datos personales que nos proporcionás son utilizados 
              únicamente para procesar tus pedidos y mejorar nuestro servicio. No compartimos 
              tu información con terceros sin tu consentimiento, excepto cuando sea necesario 
              para completar tu compra (ej: servicio de correo).
            </p>

            <h2 className="text-2xl font-display font-bold text-foreground mt-8">8. Propiedad Intelectual</h2>
            <p className="text-muted-foreground">
              Todo el contenido de este sitio (textos, imágenes, logos, diseño) es propiedad de 
              Farmacia Veterinaria Garay o de sus respectivos dueños y está protegido por las 
              leyes de propiedad intelectual.
            </p>

            <h2 className="text-2xl font-display font-bold text-foreground mt-8">9. Limitación de Responsabilidad</h2>
            <p className="text-muted-foreground">
              No nos responsabilizamos por daños indirectos derivados del uso de nuestros productos 
              o servicios. Recomendamos consultar con un veterinario antes de administrar cualquier 
              medicamento a tu mascota.
            </p>

            <h2 className="text-2xl font-display font-bold text-foreground mt-8">10. Modificaciones</h2>
            <p className="text-muted-foreground">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios entran en vigencia desde su publicación en el sitio.
            </p>

            <h2 className="text-2xl font-display font-bold text-foreground mt-8">11. Contacto</h2>
            <p className="text-muted-foreground">
              Para consultas sobre estos términos, contactanos por WhatsApp o email.
            </p>

            <div className="mt-12 p-6 bg-muted/50 rounded-xl">
              <p className="text-foreground font-semibold mb-2">¿Tenés dudas?</p>
              <p className="text-muted-foreground mb-4">
                Estamos para ayudarte a resolver cualquier consulta.
              </p>
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Contactanos
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
