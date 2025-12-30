import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria José",
    role: "Vendedora no mercado",
    quote: "Agora sei para onde vai meu dinheiro. Antes perdia tudo sem saber como.",
    avatar: "MJ",
  },
  {
    name: "Carlos Mucavele",
    role: "Trabalhador assalariado",
    quote: "Finalmente consegui poupar para a escola dos meus filhos. O MiniGestor mudou minha vida.",
    avatar: "CM",
  },
  {
    name: "Fátima Nhaca",
    role: "Empreendedora",
    quote: "Uso com M-Pesa todos os dias. É muito fácil de usar, mesmo no telemóvel simples.",
    avatar: "FN",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que dizem os usuários
          </h2>
          <p className="text-lg text-muted-foreground">
            Histórias reais de pessoas que transformaram suas finanças.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl border border-border relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              
              <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
