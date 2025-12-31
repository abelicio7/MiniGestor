import { Lock } from "lucide-react";
import { ReactNode } from "react";

interface LockedFeatureProps {
  children: ReactNode;
  isLocked: boolean;
  message?: string;
  onUnlock?: () => void;
}

const LockedFeature = ({
  children,
  isLocked,
  message = "Recurso bloqueado",
  onUnlock,
}: LockedFeatureProps) => {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="blur-[2px] pointer-events-none select-none opacity-60">
        {children}
      </div>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg cursor-pointer"
        onClick={onUnlock}
      >
        <div className="bg-card border border-border rounded-xl p-4 shadow-lg text-center max-w-xs">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">{message}</p>
          <p className="text-xs text-muted-foreground">
            Ative o Plano Pro para desbloquear
          </p>
        </div>
      </div>
    </div>
  );
};

export default LockedFeature;
