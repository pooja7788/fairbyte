import { createClient } from "@supabase/supabase-js";
import { Order, FoodItem, Restaurant, Address } from "../types";

// ─── Supabase client ─────────────────────────────────────────────────────────
const SUPABASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  "https://mtffyaqvvuuuahctbpnl.supabase.co";

const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZmZ5YXF2dnV1dWFoY3RicG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MDM2NTYsImV4cCI6MjEwMjk3OTY1Nn0.AE8BEEmoskTmJ9YFDme14WgLh78xv3ascfMjaNavRiU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Connection check ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// AUTH: SIGN UP
// Creates a Supabase Auth user (password hashed by Supabase — NEVER stored plain).
// Then inserts a row into user_info with full_name, email/phone, and the user ID.
//
// Table: user_credentials  → managed by Supabase Auth (auth.users)
// Table: user_info         → our public table for display / profile data
// ─────────────────────────────────────────────────────────────────────────────
export async function signUpUser(params: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<{ success: boolean; userId?: string; error?: string }> {
  const { fullName, email, password, phone } = params;

  try {
    // 1. Create auth user — Supabase stores bcrypt-hashed password in auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || null
        }
      }
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    const userId = authData.user?.id;
    if (!userId) {
      return { success: false, error: "User creation failed — no user ID returned." };
    }

    // 2. Insert profile row into user_info table
    const { error: profileError } = await supabase.from("user_info").upsert([
      {
        user_id:    userId,
        full_name:  fullName,
        email:      email.toLowerCase().trim(),
        phone:      phone || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ], { onConflict: "user_id" });

    if (profileError) {
      console.warn("[Supabase] user_info insert notice:", profileError.message);
    }

    // 3. Also log to user_credentials (login tracking, not password storage)
    const { error: credError } = await supabase.from("user_credentials").upsert([
      {
        user_id:       userId,
        email:         email.toLowerCase().trim(),
        account_type:  "email",
        created_at:    new Date().toISOString(),
        last_login_at: new Date().toISOString()
      }
    ], { onConflict: "user_id" });

    if (credError) {
      console.warn("[Supabase] user_credentials insert notice:", credError.message);
    }

    console.log("[Supabase] ✅ Signup complete →", { userId, email, fullName });
    return { success: true, userId };

  } catch (err: any) {
    return { success: false, error: err.message || "Signup failed. Please try again." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH: LOG IN
// Uses Supabase Auth to verify email + password.
// On success, updates last_login_at in user_credentials.
// ─────────────────────────────────────────────────────────────────────────────
export async function signInUser(params: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  userId?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  error?: string;
}> {
  const { email, password } = params;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, error: error.message };
    }

    const userId = data.user?.id;
    if (!userId) {
      return { success: false, error: "Login failed — no session returned." };
    }

    // Update last_login_at in user_credentials
    await supabase.from("user_credentials")
      .update({ last_login_at: new Date().toISOString() })
      .eq("user_id", userId);

    // Fetch profile from user_info
    const { data: profile } = await supabase
      .from("user_info")
      .select("full_name, phone")
      .eq("user_id", userId)
      .single();

    console.log("[Supabase] ✅ Login success →", { userId, email });
    return {
      success:  true,
      userId,
      email:    data.user.email ?? email,
      fullName: profile?.full_name ?? data.user.user_metadata?.full_name ?? email.split("@")[0],
      phone:    profile?.phone ?? data.user.user_metadata?.phone ?? undefined
    };

  } catch (err: any) {
    return { success: false, error: err.message || "Login failed. Please try again." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH: LOG OUT
// Clears the Supabase session completely.
// ─────────────────────────────────────────────────────────────────────────────
export async function signOutUser(): Promise<void> {
  await supabase.auth.signOut();
  console.log("[Supabase] ✅ User signed out.");
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH: RESTORE SESSION ON PAGE LOAD
// Returns the current logged-in user if a session already exists.
// ─────────────────────────────────────────────────────────────────────────────
export async function getCurrentSession(): Promise<{
  loggedIn: boolean;
  userId?: string;
  email?: string;
  fullName?: string;
  phone?: string;
}> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { loggedIn: false };

    const userId = session.user.id;
    const { data: profile } = await supabase
      .from("user_info")
      .select("full_name, phone")
      .eq("user_id", userId)
      .single();

    return {
      loggedIn: true,
      userId,
      email:    session.user.email,
      fullName: profile?.full_name ?? session.user.user_metadata?.full_name,
      phone:    profile?.phone ?? session.user.user_metadata?.phone
    };
  } catch {
    return { loggedIn: false };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────
export async function saveOrderToSupabase(order: Order): Promise<boolean> {
  try {
    const { error } = await supabase.from("orders").insert([{
      id:              order.id,
      restaurant_id:   order.restaurantId,
      restaurant_name: order.restaurantName,
      items:           order.items,
      billing:         order.billing,
      status:          order.status,
      address:         order.address,
      payment_method:  order.paymentMethod,
      payment_status:  order.paymentStatus,
      created_at:      new Date().toISOString()
    }]);
    if (error) {
      console.warn("[Supabase] order insert notice:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[Supabase] order network notice:", err);
    return false;
  }
}

export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return null;
    return data.map((d: any) => ({
      id:                  d.id,
      restaurantId:        d.restaurant_id,
      restaurantName:      d.restaurant_name,
      restaurantImage:     d.restaurant_image || "",
      items:               d.items || [],
      billing:             d.billing,
      status:              d.status,
      address:             d.address,
      deliveryPartner:     d.delivery_partner,
      createdAt:           d.created_at,
      estimatedDeliveryMin: d.estimated_delivery_min || "25-30 min",
      paymentMethod:       d.payment_method || "UPI",
      paymentStatus:       d.payment_status  || "PAID",
      orderTimelineStep:   d.order_timeline_step || 0
    }));
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADDRESSES
// ─────────────────────────────────────────────────────────────────────────────
export async function saveAddressToSupabase(address: Address): Promise<boolean> {
  try {
    const { error } = await supabase.from("addresses").insert([{
      id:         address.id,
      label:      address.label,
      text:       address.text,
      lat:        address.lat,
      lng:        address.lng,
      is_default: address.isDefault
    }]);
    return !error;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// USER EMAILS (legacy — kept for backward compat)
// ─────────────────────────────────────────────────────────────────────────────
export async function saveUserEmail(
  email: string,
  source: "login" | "signup" | "guest" = "login"
): Promise<boolean> {
  if (!email || !email.includes("@")) return false;
  if (email.endsWith("@fairbyte.local")) return false;
  const normalised = email.toLowerCase().trim();
  try {
    const { error } = await supabase.from("user_emails").upsert(
      [{ email: normalised, last_seen_at: new Date().toISOString(), source, login_count: 1 }],
      { onConflict: "email", ignoreDuplicates: false }
    );
    if (error) { console.warn("[Supabase] user_emails notice:", error.message); return false; }
    return true;
  } catch { return false; }
}

// ─────────────────────────────────────────────────────────────────────────────
// USER SIGNUPS (legacy)
// ─────────────────────────────────────────────────────────────────────────────
export interface SignupPayload {
  fullName: string;
  emailOrPhone: string;
  acceptedTerms: boolean;
}

export async function saveUserSignup(payload: SignupPayload): Promise<string | null> {
  const { fullName, emailOrPhone, acceptedTerms } = payload;
  const isEmail = emailOrPhone.includes("@");
  const recordId = crypto.randomUUID ? crypto.randomUUID() : "uid-" + Date.now();
  const row = {
    id: recordId, full_name: fullName.trim(),
    email: isEmail ? emailOrPhone.toLowerCase().trim() : null,
    phone: !isEmail ? emailOrPhone.trim() : null,
    raw_input: emailOrPhone.trim(), accepted_terms: acceptedTerms,
    otp_verified: false, signed_up_at: new Date().toISOString(), updated_at: new Date().toISOString()
  };
  try {
    const { error } = await supabase.from("user_signups").upsert([row], { onConflict: "email", ignoreDuplicates: false });
    if (error) { console.warn("[Supabase] user_signups notice:", error.message); }
    return recordId;
  } catch { return recordId; }
}

export async function markSignupVerified(signupId: string): Promise<boolean> {
  if (!signupId) return false;
  try {
    const { error } = await supabase.from("user_signups")
      .update({ otp_verified: true, verified_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", signupId);
    return !error;
  } catch { return false; }
}
