import { HelpCircle, TrendingDown, AlertCircle } from "lucide-react";

const Problem = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-destructive" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Você trabalha, ganha dinheiro…{" "}
            <span className="text-destructive">mas nunca sabe para onde ele vai?</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10">
            É difícil controlar o que entra e sai quando você usa dinheiro, M-Pesa e banco ao mesmo tempo.
            O salário parece sumir antes do fim do mês.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border text-left">
              <TrendingDown className="w-8 h-8 text-destructive mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Dinheiro que desaparece</h3>
              <p className="text-muted-foreground text-sm">
                Pequenos gastos diários que você nem percebe, mas que somam muito no final do mês.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border text-left">
              <AlertCircle className="w-8 h-8 text-warning mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Sem visão clara</h3>
              <p className="text-muted-foreground text-sm">
                Você não sabe quanto tem em cada lugar nem se vai conseguir pagar as contas do mês.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
