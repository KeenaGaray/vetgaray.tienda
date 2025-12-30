import { Layout } from "@/components/layout/Layout";
import { Heart, Shield, Users, Award } from "lucide-react";

const valores = [
  {
    icon: Heart,
    title: "Amor por los animales",
    description: "Cada mascota merece el mejor cuidado. Trabajamos con pasión para brindar productos que mejoren su calidad de vida.",
  },
  {
    icon: Shield,
    title: "Calidad garantizada",
    description: "Solo trabajamos con marcas reconocidas y productos aprobados por profesionales veterinarios.",
  },
  {
    icon: Users,
    title: "Asesoramiento profesional",
    description: "Nuestro equipo está capacitado para orientarte en el cuidado de tu mascota.",
  },
  {
    icon: Award,
    title: "Experiencia",
    description: "Años de trayectoria nos respaldan como referentes en el cuidado de mascotas.",
  },
];

export default function Nosotros() {
  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Sobre Nosotros
            </h1>
            <p className="text-xl opacity-90">
              Somos una farmacia veterinaria comprometida con la salud y el bienestar de tus mascotas.
            </p>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">
              Nuestra Historia
            </h2>
            <div className="prose prose-lg text-muted-foreground space-y-4">
              <p>
                Farmacia Veterinaria Garay nació con una misión clara: ofrecer productos de calidad 
                para el cuidado integral de las mascotas argentinas. Desde nuestros inicios, nos 
                dedicamos a seleccionar los mejores productos del mercado, trabajando de la mano 
                con veterinarios y especialistas.
              </p>
              <p>
                Hoy, somos referentes en el rubro, atendiendo a miles de familias que confían en 
                nosotros para el cuidado de sus compañeros de cuatro patas. Nuestra tienda online 
                nos permite llegar a todo el país, manteniendo siempre el mismo compromiso de 
                calidad y servicio.
              </p>
              <p>
                Creemos que cada mascota merece lo mejor, y trabajamos cada día para hacer eso 
                posible. Gracias por ser parte de nuestra familia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor) => (
              <div
                key={valor.title}
                className="bg-card rounded-xl p-6 shadow-card text-center"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <valor.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  {valor.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {valor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              ¿Tenés alguna consulta?
            </h2>
            <p className="text-muted-foreground mb-6">
              Estamos para ayudarte. Contactanos por WhatsApp o visitá nuestra página de contacto.
            </p>
            <a
              href="https://wa.me/5491112345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-success text-success-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
