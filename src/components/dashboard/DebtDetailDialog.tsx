import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DebtPaymentForm } from "./forms/DebtPaymentForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Plus, CheckCircle, Calendar, Wallet } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

type Debt = Tables<"debts">;

interface DebtPayment {
  id: string;
  amount: number;
  note: string | null;
  created_at: string;
}

interface DebtDetailDialogProps {
  debt: Debt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const DebtDetailDialog = ({
  debt,
  open,
  onOpenChange,
  onUpdate,
}: DebtDetailDialogProps) => {
  const { toast } = useToast();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [payments, setPayments] = useState<DebtPayment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debt && open) {
      fetchPayments();
    }
  }, [debt, open]);

  const fetchPayments = async () => {
    if (!debt) return;
    const { data } = await supabase
      .from("debt_payments")
      .select("*")
      .eq("debt_id", debt.id)
      .order("created_at", { ascending: false });
    setPayments(data || []);
  };

  if (!debt) return null;

  const paidAmount = Number(debt.total_amount) - Number(debt.remaining_amount);
  const progress = (paidAmount / Number(debt.total_amount)) * 100;
  const isPaid = Number(debt.remaining_amount) <= 0 || debt.status === "paid";

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("debts").delete().eq("id", debt.id);
      if (error) throw error;
      toast({ title: "Dívida excluída com sucesso" });
      onOpenChange(false);
      onUpdate();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a dívida",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowDeleteAlert(false);
    }
  };

  const handleMarkAsPaid = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("debts")
        .update({ status: "paid", remaining_amount: 0 })
        .eq("id", debt.id);
      if (error) throw error;
      toast({ title: "Dívida marcada como quitada!" });
      onUpdate();
      onOpenChange(false);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a dívida",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    fetchPayments();
    onUpdate();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-destructive" />
              {debt.creditor}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex justify-between items-center">
              <Badge variant={isPaid ? "default" : "secondary"}>
                {isPaid ? "Quitada" : "Ativa"}
              </Badge>
              {debt.due_day && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Vence dia {debt.due_day}
                </span>
              )}
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso de Pagamento</span>
                <span className="font-medium">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Pago: {paidAmount.toLocaleString("pt-MZ")} MT</span>
                <span>Total: {Number(debt.total_amount).toLocaleString("pt-MZ")} MT</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Valor Restante</p>
                <p className="font-semibold text-destructive">
                  {Number(debt.remaining_amount).toLocaleString("pt-MZ")} MT
                </p>
              </div>
              {debt.monthly_payment && (
                <div>
                  <p className="text-xs text-muted-foreground">Prestação Mensal</p>
                  <p className="font-semibold">
                    {Number(debt.monthly_payment).toLocaleString("pt-MZ")} MT
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Payment Form or Actions */}
            {showPaymentForm ? (
              <DebtPaymentForm
                debtId={debt.id}
                remainingAmount={Number(debt.remaining_amount)}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPaymentForm(false)}
              />
            ) : (
              <div className="space-y-3">
                {!isPaid && (
                  <Button
                    onClick={() => setShowPaymentForm(true)}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Pagamento
                  </Button>
                )}

                {!isPaid && (
                  <Button
                    variant="outline"
                    onClick={handleMarkAsPaid}
                    disabled={loading}
                    className="w-full"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marcar como Quitada
                  </Button>
                )}

                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteAlert(true)}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Dívida
                </Button>
              </div>
            )}

            {/* Payment History */}
            {payments.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Histórico de Pagamentos</h4>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm"
                        >
                          <div>
                            <p className="font-medium text-primary">
                              +{Number(payment.amount).toLocaleString("pt-MZ")} MT
                            </p>
                            {payment.note && (
                              <p className="text-xs text-muted-foreground">{payment.note}</p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(payment.created_at), "dd MMM yyyy", { locale: pt })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir dívida?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todo o histórico de pagamentos será perdido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
