"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppProvider";
import Shell from "@/components/Shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useApp();
  const router = useRouter();
  useEffect(() => { if (hydrated && !user) router.replace("/login"); }, [hydrated, user, router]);
  if (!hydrated || !user) return null;
  return <Shell>{children}</Shell>;
}
