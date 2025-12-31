import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Crown, ArrowRight } from "lucide-react";
import { ProtectedRoute } from "@/hooks/useAuth";

const PaymentConfirmedContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border/50 shadow-2xl animate-in fade-in zoom-in duration-500">
        <CardContent className="pt-10 pb-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-success-foreground" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Pagamento Confirmado!
            </h1>
            <p className="text-muted-foreground">
              Parabéns! Seu Plano Pro foi ativado com sucesso.
            </p>
          </div>

          {/* Pro Badge */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-4 inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">MiniGestor Pro</p>
              <p className="text-sm text-muted-foreground">Acesso vitalício ativado</p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
            <p className="text-sm font-medium text-foreground mb-3">
              Agora você tem acesso a:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✅ Dashboard visual completo</li>
              <li>✅ Carteiras ilimitadas</li>
              <li>✅ Metas e alertas inteligentes</li>
              <li>✅ Relatórios PDF/Excel</li>
              <li>✅ Suporte prioritário</li>
            </ul>
          </div>

          {/* CTA Button */}
          <Button
            className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
            onClick={() => navigate("/dashboard")}
          >
            Acessar Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-xs text-muted-foreground">
            Você será redirecionado automaticamente em 10 segundos...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const PaymentConfirmed = () => {
  return (
    <ProtectedRoute>
      <PaymentConfirmedContent />
    </ProtectedRoute>
  );
};

export default PaymentConfirmed;
