"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppProvider";
import DoctorShell from "@/components/DoctorShell";

/**
 * Layout component for all doctor pages. It wraps the content in
 * DoctorShell and ensures that only authenticated users with the
 * doctor role can access these routes. If the user is not logged
 * in or has a different role they are redirected to the login
 * screen. This prevents cross-role navigation.
 */
export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!user || user.role !== "doctor") {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user || user.role !== "doctor") return null;
  return <DoctorShell>{children}</DoctorShell>;
}