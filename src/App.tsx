import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import PoliticaEnvios from "./pages/PoliticaEnvios";
import PoliticaDevoluciones from "./pages/PoliticaDevoluciones";
import Terminos from "./pages/Terminos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/coleccion/:slug" element={<Collection />} />
          <Route path="/producto/:handle" element={<Product />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/politica-envios" element={<PoliticaEnvios />} />
          <Route path="/politica-devoluciones" element={<PoliticaDevoluciones />} />
          <Route path="/terminos" element={<Terminos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
