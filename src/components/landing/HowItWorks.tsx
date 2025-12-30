import { UserPlus, Wallet, LayoutDashboard } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Cadastre-se",
    description: "Crie sua conta grátis em menos de 1 minuto. Só precisa de email ou telefone.",
  },
  {
    number: "02",
    icon: Wallet,
    title: "Registre seu dinheiro",
    description: "Adicione suas carteiras: dinheiro físico, M-Pesa, e-Mola ou conta bancária.",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Acompanhe tudo",
    description: "Veja seu saldo, gastos e metas num painel simples e fácil de entender.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona?
          </h2>
          <p className="text-lg text-muted-foreground">
            Três passos simples para começar a controlar seu dinheiro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative bg-card p-6 rounded-xl border border-border text-center">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full">
                  {step.number}
                </div>
                
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mt-4 mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="font-semibold text-foreground mb-2 text-lg">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
