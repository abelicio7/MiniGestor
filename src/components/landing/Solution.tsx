import { Check, Wallet, PieChart, Target, FileText } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Controle entradas e saídas",
    description: "Registe cada metical que entra ou sai, com categorias simples.",
  },
  {
    icon: PieChart,
    title: "Acompanhe M-Pesa, e-Mola e dinheiro",
    description: "Veja todo o seu dinheiro num só lugar, organizado por método.",
  },
  {
    icon: Target,
    title: "Planeje metas e quite dívidas",
    description: "Defina objetivos de poupança e acompanhe o progresso.",
  },
  {
    icon: FileText,
    title: "Veja seu saldo em segundos",
    description: "Dashboard simples que mostra tudo o que você precisa saber.",
  },
];

const Solution = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O MiniGestor mostra tudo de forma{" "}
            <span className="text-primary">clara e simples</span>
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Finalmente, uma ferramenta feita para a realidade de Moçambique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card p-6 rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-lg">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solution;
