import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Grátis",
    price: "0",
    description: "Para começar a organizar suas finanças",
    features: [
      "1 método financeiro",
      "Registrar entradas e saídas",
      "Dashboard básica",
      "Histórico de 30 dias",
    ],
    cta: "Começar grátis",
    popular: false,
  },
  {
    name: "Pro",
    price: "199",
    description: "Controle total das suas finanças",
    features: [
      "Métodos ilimitados",
      "Metas financeiras",
      "Controle de dívidas",
      "Histórico ilimitado",
      "Relatórios em PDF",
      "Análises inteligentes",
    ],
    cta: "Assinar Pro",
    popular: true,
  },
];

const Pricing = () => {
  return (
    <section id="precos" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Planos simples e honestos
          </h2>
          <p className="text-lg text-muted-foreground">
            Comece grátis, evolua quando precisar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card p-6 rounded-xl border ${
                plan.popular ? "border-primary shadow-lg shadow-primary/10" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Mais popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">MZN/mês</span>
                </div>
                <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link to="/auth?mode=signup">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
