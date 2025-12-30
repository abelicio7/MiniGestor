import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, TrendingUp, Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-accent-foreground text-sm font-medium mb-6 animate-fade-up">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Feito para Moçambique
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 text-balance animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Controle seu dinheiro.{" "}
            <span className="text-primary">Viva com mais tranquilidade.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance animate-fade-up" style={{ animationDelay: "0.2s" }}>
            O MiniGestor ajuda você a organizar suas finanças do jeito que Moçambique vive. 
            M-Pesa, e-Mola, dinheiro físico — tudo num só lugar.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 shadow-lg shadow-primary/25" asChild>
              <Link to="/auth?mode=signup">
                Começar grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8" asChild>
              <a href="#como-funciona">Ver como funciona</a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              <span>Funciona no telemóvel</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Sem taxas escondidas</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: "0.5s" }}>
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            
            {/* Mock dashboard */}
            <div className="bg-card rounded-2xl shadow-2xl border border-border p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Total balance card */}
                <div className="md:col-span-3 bg-primary rounded-xl p-6 text-primary-foreground">
                  <p className="text-primary-foreground/80 text-sm mb-1">Saldo Total</p>
                  <p className="text-3xl lg:text-4xl font-bold">45.750,00 MZN</p>
                </div>
                
                {/* Wallet cards */}
                <div className="bg-accent/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-wallet-cash" />
                    <span className="text-sm text-muted-foreground">Dinheiro</span>
                  </div>
                  <p className="text-xl font-bold">12.500 MZN</p>
                </div>
                <div className="bg-accent/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-wallet-mpesa" />
                    <span className="text-sm text-muted-foreground">M-Pesa</span>
                  </div>
                  <p className="text-xl font-bold">18.250 MZN</p>
                </div>
                <div className="bg-accent/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-wallet-bank" />
                    <span className="text-sm text-muted-foreground">Banco</span>
                  </div>
                  <p className="text-xl font-bold">15.000 MZN</p>
                </div>
              </div>
              
              {/* Chart placeholder */}
              <div className="bg-muted/50 rounded-xl h-32 flex items-center justify-center">
                <div className="flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                    <div
                      key={i}
                      className="w-8 bg-primary/20 rounded-t transition-all hover:bg-primary/40"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
