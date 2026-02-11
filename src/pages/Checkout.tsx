import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, ProtectedRoute } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Smartphone, Loader2, ArrowLeft, Crown, Check, Sparkles, Infinity } from "lucide-react";
import { toast } from "sonner";

type PaymentMethod = "mpesa" | "emola";
type PlanType = "monthly" | "annual";

interface Plan {
  id: PlanType;
  name: string;
  price: number;
  description: string;
  badge?: string;
  features: string[];
}

const plans: Plan[] = [
  {
    id: "monthly",
    name: "Plano Mensal",
    price: 99,
    description: "Renovação mensal",
    features: [
      "Dashboard visual completo",
      "Carteiras ilimitadas",
      "Categorias personalizadas",
      "Metas e alertas inteligentes",
      "Histórico completo",
      "Relatórios PDF/Excel",
    ],
  },
  {
    id: "annual",
    name: "Plano Anual",
    price: 599,
    description: "Pague uma vez por ano e economize",
    badge: "Melhor Valor",
    features: [
      "Tudo do plano mensal",
      "Acesso por 12 meses",
      "Economize vs mensal",
      "Todas as futuras atualizações",
      "Suporte prioritário",
      "Melhor custo-benefício",
    ],
  },
];

const CheckoutContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(
    (searchParams.get("plan") as PlanType) || "annual"
  );
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(10 * 60);

  const currentPlan = plans.find((p) => p.id === selectedPlan)!;

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `00:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const validatePhone = () => {
    const validMpesa = /^8[45]/.test(phone);
    const validEmola = /^8[67]/.test(phone);

    if (method === "mpesa" && !validMpesa) {
      toast.error("Número M-Pesa inválido", {
        description: "Use um número que comece com 84 ou 85",
      });
      return false;
    }
    if (method === "emola" && !validEmola) {
      toast.error("Número e-Mola inválido", {
        description: "Use um número que comece com 86 ou 87",
      });
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Campos obrigatórios", {
        description: "Por favor preencha todos os campos.",
      });
      return;
    }

    if (!validatePhone()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("process-payment", {
        body: {
          userId: user?.id,
          name,
          email,
          phone,
          method,
          amount: currentPlan.price,
          planType: selectedPlan,
        },
      });

      if (error) {
        console.error("Payment error:", error);
        toast.error("Erro de conexão", {
          description: "Não foi possível conectar ao servidor.",
        });
        return;
      }

      if (data.success && data.paymentSuccess) {
        toast.success("Pagamento confirmado!", {
          description: selectedPlan === "annual" 
            ? "Seu Plano Anual foi ativado com sucesso." 
            : "Seu Plano Mensal foi ativado com sucesso.",
        });
        navigate("/pagamento-confirmado");
      } else {
        toast.warning("Pagamento não concluído", {
          description: data.error || "A transação foi cancelada ou falhou.",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Erro ao processar pagamento", {
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="bg-destructive text-destructive-foreground text-center py-3 text-sm font-semibold">
        Oferta expira em {formatTime(countdown)}
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        {/* Plan Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all relative ${
                selectedPlan === plan.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border/50 hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {plan.id === "annual" ? (
                      <Crown className="w-5 h-5 text-primary" />
                    ) : (
                      <Crown className="w-5 h-5 text-primary" />
                    )}
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary">
                  MT {plan.price},00
                  <span className="text-sm font-normal text-muted-foreground">
                    {plan.id === "monthly" ? "/mês" : "/ano"}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="pt-2">
                <ul className="space-y-1">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs">
                      <Check className="w-3 h-3 text-success flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-4">
            {/* Security Badge */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-success" />
                <span className="font-medium">Pagamento 100% Seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs">🇲🇿</span>
                <span className="text-muted-foreground text-xs">Moçambique</span>
              </div>
            </div>

            {/* Selected Plan Info */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                {selectedPlan === "annual" ? (
                  <Crown className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <Crown className="w-6 h-6 text-primary-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{currentPlan.name}</p>
                <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
              </div>
              <p className="text-xl font-bold text-primary">MT {currentPlan.price},00</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <Label>Método de pagamento</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button
                    type="button"
                    variant={method === "mpesa" ? "default" : "outline"}
                    className={`h-12 ${
                      method === "mpesa"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setMethod("mpesa")}
                    disabled={loading}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    M-Pesa
                  </Button>
                  <Button
                    type="button"
                    variant={method === "emola" ? "default" : "outline"}
                    className={`h-12 ${
                      method === "emola"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setMethod("emola")}
                    disabled={loading}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    e-Mola
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Número de pagamento</Label>
                <Input
                  id="phone"
                  placeholder={method === "mpesa" ? "84/85xxxxxxx" : "86/87xxxxxxx"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {method === "mpesa"
                    ? "Use um número M-Pesa (84 ou 85)"
                    : "Use um número e-Mola (86 ou 87)"}
                </p>
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{currentPlan.name}</span>
                <span className="font-semibold">MT {currentPlan.price},00</span>
              </div>
              {selectedPlan === "annual" && (
                <p className="text-xs text-success flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Acesso por 12 meses — economize vs mensal!
                </p>
              )}
              {selectedPlan === "monthly" && (
                <p className="text-xs text-muted-foreground">
                  Renovação automática mensal
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              className="w-full h-14 text-lg bg-success hover:bg-success/90 shadow-lg"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {selectedPlan === "annual" ? (
                    <Crown className="w-5 h-5 mr-2" />
                  ) : (
                    <Crown className="w-5 h-5 mr-2" />
                  )}
                  Ativar {currentPlan.name}
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Pagamento seguro via M-Pesa ou e-Mola
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Checkout = () => {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
};

export default Checkout;
