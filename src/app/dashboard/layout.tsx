"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppProvider";
import Shell from "@/components/Shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useApp();
  const router = useRouter();
  // Only allow users with the admin role to access the district dashboard.
  useEffect(() => {
    if (!hydrated) return;
    if (!user || user.role !== "admin") {
      router.replace("/login");
    }
  }, [hydrated, user, router]);
  if (!hydrated || !user || user.role !== "admin") return null;
  return <Shell>{children}</Shell>;
}
