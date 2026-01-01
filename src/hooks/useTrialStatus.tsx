import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export type PlanStatus = "trial" | "pro" | "expired";
export type PlanType = "monthly" | "lifetime" | "free";

export interface TrialStatus {
  status: PlanStatus;
  daysRemaining: number;
  isTrialActive: boolean;
  hasFullAccess: boolean;
  isPro: boolean;
  isLifetime: boolean;
  planType: PlanType;
  trialEnd: Date | null;
  subscriptionEnd: Date | null;
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
        isLifetime: false,
        planType: "free",
        trialEnd: null,
        subscriptionEnd: null,
        loading,
      };
    }

    // Check for lifetime access - never expires
    const isLifetime = (profile as any).is_lifetime === true;
    
    // Check subscription end for monthly plans
    const subscriptionEnd = (profile as any).subscription_end 
      ? new Date((profile as any).subscription_end) 
      : null;
    const now = new Date();
    const isSubscriptionActive = subscriptionEnd ? subscriptionEnd > now : false;
    
    // Pro status: lifetime OR active monthly subscription
    const isPro = isLifetime || profile.is_pro === true || profile.plan === "pro";
    
    // Trial check
    const trialEnd = profile.trial_end ? new Date(profile.trial_end) : null;
    const isTrialActive = trialEnd ? trialEnd > now : false;
    
    // Full access: lifetime, active subscription, or active trial
    const hasFullAccess = isLifetime || isSubscriptionActive || isPro || isTrialActive;

    // Determine plan type
    let planType: PlanType = "free";
    if (isLifetime) {
      planType = "lifetime";
    } else if (isSubscriptionActive || (profile.plan === "pro" && !isLifetime)) {
      planType = "monthly";
    }

    // Determine status
    let status: PlanStatus;
    if (isLifetime || isPro || isSubscriptionActive) {
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
      isLifetime,
      planType,
      trialEnd,
      subscriptionEnd,
      loading,
    };
  }, [profile, daysRemaining, loading]);

  return trialStatus;
};
