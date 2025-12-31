import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export type PlanStatus = "trial" | "pro" | "expired";

export interface TrialStatus {
  status: PlanStatus;
  daysRemaining: number;
  isTrialActive: boolean;
  hasFullAccess: boolean;
  isPro: boolean;
  trialEnd: Date | null;
  loading: boolean;
}

export const useTrialStatus = (profile: Profile | null): TrialStatus => {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDaysRemaining = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc("get_trial_days_remaining", {
          user_id: user.id,
        });

        if (!error && data !== null) {
          setDaysRemaining(data);
        }
      } catch (err) {
        console.error("Error fetching trial days:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDaysRemaining();
  }, [user]);

  const trialStatus = useMemo((): TrialStatus => {
    if (!profile) {
      return {
        status: "trial",
        daysRemaining: 30,
        isTrialActive: true,
        hasFullAccess: true,
        isPro: false,
        trialEnd: null,
        loading,
      };
    }

    const isPro = profile.plan === "pro" || profile.is_pro === true;
    const trialEnd = profile.trial_end ? new Date(profile.trial_end) : null;
    const now = new Date();
    const isTrialActive = trialEnd ? trialEnd > now : false;
    const hasFullAccess = isPro || isTrialActive;

    let status: PlanStatus;
    if (isPro) {
      status = "pro";
    } else if (isTrialActive) {
      status = "trial";
    } else {
      status = "expired";
    }

    return {
      status,
      daysRemaining,
      isTrialActive,
      hasFullAccess,
      isPro,
      trialEnd,
      loading,
    };
  }, [profile, daysRemaining, loading]);

  return trialStatus;
};
