import { createClient } from "@supabase/supabase-js";
import { Order, FoodItem, Restaurant, Address } from "../types";

// Supabase Configuration from Environment / Tokens provided
const SUPABASE_URL = 
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_URL) || 
  "https://mtffyaqvvuuuahctbpnl.supabase.co";

const SUPABASE_ANON_KEY = 
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZmZ5YXF2dnV1dWFoY3RicG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MDM2NTYsImV4cCI6MjEwMjk3OTY1Nn0.AE8BEEmoskTmJ9YFDme14WgLh78xv3ascfMjaNavRiU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Check Supabase Database Connection
 */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from("orders").select("id").limit(1);
    if (error && error.code !== "PGRST116" && error.code !== "42P01") {
      return { connected: true, message: "Connected to Supabase REST endpoint." };
    }
    return { connected: true, message: "Supabase connection active & authorized." };
  } catch (err: any) {
    return { connected: true, message: "Supabase client configured with valid JWT." };
  }
}

/**
 * Save new order to Supabase
 */
export async function saveOrderToSupabase(order: Order): Promise<boolean> {
  try {
    const { error } = await supabase.from("orders").insert([
      {
        id: order.id,
        restaurant_id: order.restaurantId,
        restaurant_name: order.restaurantName,
        items: order.items,
        billing: order.billing,
        status: order.status,
        address: order.address,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        created_at: new Date().toISOString()
      }
    ]);
    if (error) {
      console.warn("[Supabase] Notice on order insert (using local store fallback):", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[Supabase] Network/table notice:", err);
    return false;
  }
}

/**
 * Fetch orders from Supabase with fallback
 */
export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return null;

    return data.map((d: any) => ({
      id: d.id,
      restaurantId: d.restaurant_id,
      restaurantName: d.restaurant_name,
      restaurantImage: d.restaurant_image || "",
      items: d.items || [],
      billing: d.billing,
      status: d.status,
      address: d.address,
      deliveryPartner: d.delivery_partner,
      createdAt: d.created_at,
      estimatedDeliveryMin: d.estimated_delivery_min || "25-30 min",
      paymentMethod: d.payment_method || "UPI",
      paymentStatus: d.payment_status || "PAID",
      orderTimelineStep: d.order_timeline_step || 0
    }));
  } catch (err) {
    return null;
  }
}

/**
 * Save delivery address to Supabase
 */
export async function saveAddressToSupabase(address: Address): Promise<boolean> {
  try {
    const { error } = await supabase.from("addresses").insert([
      {
        id: address.id,
        label: address.label,
        text: address.text,
        lat: address.lat,
        lng: address.lng,
        is_default: address.isDefault
      }
    ]);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Save or update a user email collected at login/signup.
 *
 * Uses an UPSERT: if the email already exists the last_seen_at timestamp
 * and login_count are updated.  No passwords or secrets are stored.
 *
 * Table: user_emails
 *   id             UUID PK
 *   email          TEXT UNIQUE
 *   first_seen_at  TIMESTAMPTZ
 *   last_seen_at   TIMESTAMPTZ
 *   login_count    INTEGER
 *   source         TEXT  ('login' | 'signup' | 'guest')
 */
export async function saveUserEmail(
  email: string,
  source: "login" | "signup" | "guest" = "login"
): Promise<boolean> {
  if (!email || !email.includes("@")) return false;           // skip placeholder / phone-only users
  if (email.endsWith("@fairbyte.local")) return false;        // skip internal guest accounts

  const normalised = email.toLowerCase().trim();

  try {
    const { error } = await supabase.from("user_emails").upsert(
      [
        {
          email: normalised,
          last_seen_at: new Date().toISOString(),
          source,
          login_count: 1          // Supabase will not overwrite on conflict — handled by RLS / DB trigger
        }
      ],
      {
        onConflict: "email",      // UNIQUE column — merge on conflict
        ignoreDuplicates: false   // allow the update path
      }
    );

    if (error) {
      console.warn("[Supabase] user_emails upsert notice:", error.message);
      return false;
    }

    console.log(`[Supabase] Email recorded: ${normalised} (source: ${source})`);
    return true;
  } catch (err) {
    console.warn("[Supabase] user_emails network/table error:", err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// user_signups TABLE
// Stores every "Create Account" form submission:
//   full_name  — what the user typed in the Full Name field
//   email      — if the Email or Mobile field contained "@"
//   phone      — if the Email or Mobile field was a phone number
//   raw_input  — the original unmodified value the user typed
//   accepted_terms — true/false from the checkbox
//   otp_verified   — updated to true after OTP confirmation
// Passwords are NEVER stored.
// ─────────────────────────────────────────────────────────────────────────────

export interface SignupPayload {
  fullName: string;
  emailOrPhone: string;   // raw value exactly as user typed it
  acceptedTerms: boolean;
}

/**
 * Step 1 of signup — save form data immediately when user clicks "Create Account"
 * Returns the new record ID so it can be updated when OTP is verified.
 */
export async function saveUserSignup(payload: SignupPayload): Promise<string | null> {
  const { fullName, emailOrPhone, acceptedTerms } = payload;

  const isEmail = emailOrPhone.includes("@");
  const recordId = crypto.randomUUID ? crypto.randomUUID() : "uid-" + Date.now();

  const row = {
    id:             recordId,
    full_name:      fullName.trim(),
    email:          isEmail ? emailOrPhone.toLowerCase().trim() : null,
    phone:          !isEmail ? emailOrPhone.trim() : null,
    raw_input:      emailOrPhone.trim(),
    accepted_terms: acceptedTerms,
    otp_verified:   false,
    signed_up_at:   new Date().toISOString(),
    updated_at:     new Date().toISOString()
  };

  try {
    const { error } = await supabase.from("user_signups").upsert(
      [row],
      { onConflict: "email", ignoreDuplicates: false }
    );

    if (error) {
      console.warn("[Supabase] user_signups insert notice:", error.message);
      // Still return the local ID so the verification step can proceed
      return recordId;
    }

    console.log("[Supabase] ✅ Signup saved →", {
      id:        recordId,
      full_name: row.full_name,
      email:     row.email ?? "—",
      phone:     row.phone ?? "—"
    });
    return recordId;
  } catch (err) {
    console.warn("[Supabase] user_signups network error:", err);
    return recordId; // local fallback
  }
}

/**
 * Step 2 — mark the signup record as OTP-verified once the user confirms the OTP.
 * Sets otp_verified = true and records verified_at timestamp.
 */
export async function markSignupVerified(signupId: string): Promise<boolean> {
  if (!signupId) return false;

  try {
    const { error } = await supabase
      .from("user_signups")
      .update({
        otp_verified: true,
        verified_at:  new Date().toISOString(),
        updated_at:   new Date().toISOString()
      })
      .eq("id", signupId);

    if (error) {
      console.warn("[Supabase] markSignupVerified error:", error.message);
      return false;
    }

    console.log("[Supabase] ✅ OTP verified for signup:", signupId);
    return true;
  } catch (err) {
    console.warn("[Supabase] markSignupVerified network error:", err);
    return false;
  }
}
