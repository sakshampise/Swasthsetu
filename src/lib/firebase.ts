/*
  SwasthSetu AI now uses Supabase Auth by default because the project already
  includes @supabase/supabase-js and a Supabase database schema.

  Firebase Authentication can still be plugged in later by replacing the auth
  functions in src/lib/auth.ts with Firebase equivalents. Keep this file as a
  provider readiness indicator for teams that prefer Firebase.
*/

export const firebaseReady =
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
