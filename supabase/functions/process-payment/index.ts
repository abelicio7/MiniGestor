import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  userId: string;
  name: string;
  email: string;
  phone: string;
  method: "mpesa" | "emola";
  amount: number;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, name, email, phone, method, amount }: PaymentRequest = await req.json();

    console.log(`Processing payment for user ${userId}, method: ${method}, amount: ${amount}`);

    // Validate required fields
    if (!userId || !name || !email || !phone || !method || !amount) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ success: false, error: "Campos obrigatórios em falta" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate phone number format
    const validMpesa = /^8[45]/.test(phone);
    const validEmola = /^8[67]/.test(phone);

    if ((method === "mpesa" && !validMpesa) || (method === "emola" && !validEmola)) {
      console.error(`Invalid phone number for ${method}: ${phone}`);
      return new Response(
        JSON.stringify({ success: false, error: "Número inválido para o método selecionado" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get EnsinaPay credentials from secrets
    const clientId = Deno.env.get("ENSINAPAY_CLIENT_ID");
    const clientSecret = Deno.env.get("ENSINAPAY_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      console.error("EnsinaPay credentials not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Configuração de pagamento em falta" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Step 1: Get OAuth token from EnsinaPay
    console.log("Fetching OAuth token from EnsinaPay...");
    const tokenResp = await fetch("https://e2payments.explicador.co.mz/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const tokenData = await tokenResp.json();
    const token = tokenData.access_token;

    if (!token) {
      console.error("Failed to get access token:", tokenData);
      return new Response(
        JSON.stringify({ success: false, error: "Erro de autenticação com o gateway de pagamento" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Token obtained successfully");

    // Step 2: Process payment based on method
    const endpoint = method === "mpesa"
      ? "https://e2payments.explicador.co.mz/v1/c2b/mpesa-payment/999813"
      : "https://e2payments.explicador.co.mz/v1/c2b/emola-payment/999814";

    console.log(`Calling payment endpoint: ${endpoint}`);

    const paymentResp = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: new URLSearchParams({
        client_id: clientId,
        amount: amount.toString(),
        reference: `mg-${userId.substring(0, 18)}`,
        phone: phone,
      }),
    });

    const paymentResult = await paymentResp.json();
    console.log("Payment response:", JSON.stringify(paymentResult, null, 2));

    // Check if payment was successful
    if (paymentResult.success && paymentResult.success.includes("sucesso")) {
      console.log("Payment successful, updating user profile...");

      // Initialize Supabase client with service role
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Update user profile to Pro
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          plan: "pro",
          is_pro: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        return new Response(
          JSON.stringify({ 
            success: true, 
            paymentSuccess: true,
            profileUpdated: false,
            error: "Pagamento realizado, mas erro ao atualizar perfil. Contacte o suporte." 
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.log("Profile updated successfully to Pro plan");

      return new Response(
        JSON.stringify({ 
          success: true, 
          paymentSuccess: true,
          profileUpdated: true,
          message: "Pagamento confirmado! Plano Pro ativado com sucesso." 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } else {
      console.log("Payment not completed or cancelled");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Pagamento não concluído ou cancelado pelo usuário" 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Erro ao processar pagamento" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
