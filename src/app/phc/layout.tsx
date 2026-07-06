"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppProvider";
import StaffShell from "@/components/StaffShell";

/**
 * Layout for the PHC/CHC staff portal. Ensures that only logged-in
 * users with the staff or manager role can access these pages. If
 * the user has a different role they are redirected to the login
 * page. The centre-specific pages use the user's associated centre
 * to filter data.
 */
export default function PHCLayout({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (!hydrated) return;
    if (!user || (user.role !== "staff" && user.role !== "manager")) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);
  if (!hydrated || !user || (user.role !== "staff" && user.role !== "manager")) return null;
  return <StaffShell>{children}</StaffShell>;
}