import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export type AppRole = "patient" | "doctor" | "staff" | "manager" | "admin";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  centre: string | null;
  phone?: string | null;
};

export type PatientSignupPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dob?: string;
  gender?: string;
  bloodType?: string;
};

export type AccessApplicationPayload = {
  fullName: string;
  email: string;
  phone?: string;
  requestedRole: "doctor" | "staff" | "manager" | "admin";
  hospitalName?: string;
  licenceNumber?: string;
  department?: string;
  message?: string;
};

export const authConfigured = () => isSupabaseConfigured;

const normalizeRole = (role?: string | null): AppRole => {
  if (role === "doctor" || role === "staff" || role === "manager" || role === "admin" || role === "patient") return role;
  return "patient";
};

export function routeForRole(role?: string | null) {
  switch (role) {
    case "patient": return "/patient";
    case "doctor": return "/doctor";
    case "staff":
    case "manager": return "/phc";
    case "admin": return "/dashboard";
    default: return "/login";
  }
}

function getClient() {
  return getSupabaseClient();
}

export async function getProfile(user: SupabaseUser): Promise<AppUser> {
  const client = getClient();
  const { data, error } = await client
    .from("auth_profiles")
    .select("id, full_name, role, centre, phone")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Profile not found in database.");

  return {
    id: user.id,
    name: data.full_name || user.email || "User",
    email: user.email || "",
    role: data.role as AppRole,
    centre: data.centre || null,
    phone: data.phone || null,
  };
}

export async function signInWithEmail(email: string, password: string): Promise<AppUser> {
  const client = getClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error("Login failed. Please try again.");
  return getProfile(data.user);
}

export async function signUpPatient(payload: PatientSignupPayload): Promise<{ user: AppUser | null; needsConfirmation: boolean }> {
  const client = getClient();
  const { data, error } = await client.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.name,
        name: payload.name,
        role: "patient",
        phone: payload.phone || null,
        dob: payload.dob || null,
        gender: payload.gender || null,
        blood_type: payload.bloodType || null,
      },
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error("Account creation failed. Please try again.");

  // If email confirmation is disabled, Supabase returns a live session and we can
  // immediately write the profile. If confirmation is enabled, the DB trigger in
  // supabase/schema.sql creates the profile from user metadata.
  if (data.session) {
    const { error: profileError } = await client.from("auth_profiles").upsert({
      id: data.user.id,
      email: payload.email,
      full_name: payload.name,
      role: "patient",
      centre: null,
      phone: payload.phone || null,
      dob: payload.dob || null,
      gender: payload.gender || null,
      blood_type: payload.bloodType || null,
    });
    if (profileError) throw profileError;
    return { user: await getProfile(data.user), needsConfirmation: false };
  }

  return { user: null, needsConfirmation: true };
}

export async function sendPasswordReset(email: string) {
  const client = getClient();
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
  const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

export async function signOutUser() {
  const client = getClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function submitAccessApplication(payload: AccessApplicationPayload) {
  const client = getClient();
  const { error } = await client.from("access_applications").insert({
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone || null,
    requested_role: payload.requestedRole,
    hospital_name: payload.hospitalName || null,
    licence_number: payload.licenceNumber || null,
    department: payload.department || null,
    message: payload.message || null,
  });
  if (error) throw error;
}
