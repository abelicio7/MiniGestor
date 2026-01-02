import { Clock, Crown, Lock, AlertTriangle, Infinity, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanStatus } from "@/hooks/useTrialStatus";
import { useNavigate } from "react-router-dom";

interface TrialBannerProps {
  status: PlanStatus;
  daysRemaining: number;
  onUpgrade: () => void;
}

const TrialBanner = ({ status, daysRemaining, onUpgrade }: TrialBannerProps) => {
  const navigate = useNavigate();

  const handlePlanSelect = (planType: "monthly" | "lifetime") => {
    navigate(`/checkout?plan=${planType}`);
  };

  if (status === "pro") {
    return (
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Plano Pro Ativo</p>
            <p className="text-sm text-muted-foreground">
              Todos os recursos estão liberados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="bg-gradient-to-r from-destructive/20 to-destructive/10 border border-destructive/30 rounded-xl p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Período Gratuito Expirado</p>
              <p className="text-sm text-muted-foreground">
                Para continuar usando o MiniGestor e manter seus dados, ative o Plano Pro.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => handlePlanSelect("monthly")} 
              variant="outline"
              className="flex-1 min-w-[140px] border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Mensal - 199 MT
            </Button>
            <Button 
              onClick={() => handlePlanSelect("lifetime")} 
              className="flex-1 min-w-[140px] bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Infinity className="w-4 h-4 mr-2" />
              Vitalício - 599 MT
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Trial status
  const isUrgent = daysRemaining <= 3;

  return (
    <div
      className={`bg-gradient-to-r ${
        isUrgent
          ? "from-warning/20 to-warning/10 border-warning/30"
          : "from-info/20 to-info/10 border-info/30"
      } border rounded-xl p-4`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${
                isUrgent ? "bg-warning/20" : "bg-info/20"
              } flex items-center justify-center`}
            >
              {isUrgent ? (
                <AlertTriangle className={`w-5 h-5 text-warning`} />
              ) : (
                <Clock className={`w-5 h-5 text-info`} />
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {isUrgent ? "Seu trial está acabando!" : "Teste Gratuito"}
              </p>
              <p className="text-sm text-muted-foreground">
                {daysRemaining === 1
                  ? "Resta 1 dia para aproveitar todos os recursos do MiniGestor."
                  : `Restam ${daysRemaining} dias para aproveitar todos os recursos do MiniGestor.`}
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-bold text-foreground">{daysRemaining}</p>
            <p className="text-xs text-muted-foreground">
              {daysRemaining === 1 ? "dia restante" : "dias restantes"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => handlePlanSelect("monthly")} 
            variant="outline"
            className="flex-1 min-w-[140px] border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Mensal - 199 MT
          </Button>
          <Button 
            onClick={() => handlePlanSelect("lifetime")} 
            className="flex-1 min-w-[140px] bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Infinity className="w-4 h-4 mr-2" />
            Vitalício - 599 MT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;
