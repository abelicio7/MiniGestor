import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-16 lg:py-24 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Comece hoje a cuidar melhor do seu dinheiro
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Milhares de moçambicanos já controlam suas finanças com o MiniGestor. 
            Junte-se a eles — é grátis para começar.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8"
            asChild
          >
            <Link to="/auth?mode=signup">
              Criar conta gratuita
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
