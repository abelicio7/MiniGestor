import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, ProtectedRoute } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Smartphone, Loader2, ArrowLeft, Crown, Check } from "lucide-react";
import { toast } from "sonner";

type PaymentMethod = "mpesa" | "emola";

const CheckoutContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(10 * 60);

  const price = 299;

  useEffect(() => {
    // Pre-fill email from user
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
          amount: price,
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
          description: "Seu Plano Pro foi ativado com sucesso.",
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

  const features = [
    "Dashboard visual completo",
    "Carteiras ilimitadas",
    "Categorias personalizadas",
    "Metas e alertas inteligentes",
    "Histórico completo",
    "Relatórios PDF/Excel",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="bg-destructive text-destructive-foreground text-center py-3 text-sm font-semibold">
        Oferta expira em {formatTime(countdown)}
      </div>

      <div className="container max-w-lg mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

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

            {/* Product Info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Crown className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Plano Pro MiniGestor</CardTitle>
                <p className="text-sm text-muted-foreground">Acesso vitalício</p>
                <p className="text-xl font-bold text-primary">MT {price},00</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Features Preview */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">
                O que você vai desbloquear:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

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
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Plano Pro MiniGestor</span>
                <span className="font-semibold">MT {price},00</span>
              </div>
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
                  <Crown className="w-5 h-5 mr-2" />
                  Ativar Plano Pro
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
