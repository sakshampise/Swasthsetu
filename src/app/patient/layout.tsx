"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppProvider";
import PatientShell from "@/components/PatientShell";

/**
 * Layout for all patient pages. Wraps content with the PatientShell
 * navigation and top bar. By using a layout component we avoid
 * duplicating the shell across each page.
 */
export default function PatientLayout({ children }: { children: React.ReactNode }) {
  // Enforce that only authenticated users with the patient role can access
  // the patient portal. If the user is not logged in or has a different
  // role we redirect them back to the login page. The hydrated flag
  // ensures we don't flash the redirect on first render while the
  // AppProvider restores state from localStorage.
  const { user, hydrated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    // If there is no user or the user has a different role, redirect.
    if (!user || user.role !== "patient") {
      router.replace("/login");
    }
  }, [hydrated, user, router]);
  // Until hydration completes and the role check passes, don't render
  // anything. This avoids showing the portal briefly to the wrong user.
  if (!hydrated || !user || user.role !== "patient") return null;
  return <PatientShell>{children}</PatientShell>;
}