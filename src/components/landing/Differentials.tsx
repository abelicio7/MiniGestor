import { MapPin, Feather, MessageCircle, Heart, Shield } from "lucide-react";

const differentials = [
  {
    icon: MapPin,
    title: "Feito para Moçambique",
    description: "Entendemos M-Pesa, e-Mola e a realidade local.",
  },
  {
    icon: Feather,
    title: "Simples e leve",
    description: "Funciona bem mesmo com internet lenta.",
  },
  {
    icon: MessageCircle,
    title: "Sem termos complicados",
    description: "Linguagem clara que qualquer pessoa entende.",
  },
  {
    icon: Heart,
    title: "Ético e transparente",
    description: "Sem promessas falsas ou táticas agressivas.",
  },
  {
    icon: Shield,
    title: "Seus dados são seus",
    description: "Privacidade respeitada, sem venda de dados.",
  },
];

const Differentials = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que escolher o MiniGestor?
          </h2>
          <p className="text-lg text-muted-foreground">
            Construído com valores que importam.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-card px-5 py-3 rounded-full border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground text-sm">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Differentials;
