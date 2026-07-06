"use client";
import React, { useMemo } from "react";
import { HEALTH_METRICS0 } from "@/lib/data";
import { Card, SectionTitle } from "@/components/ui";
import { Activity } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/**
 * Health tracker page. Visualises the patient's health metrics over time.
 * Uses a simple line chart to plot BP, weight and sugar levels. Other
 * metrics (pulse, temperature) can be added similarly.
 */
export default function HealthTrackerPage() {
  const data = useMemo(() => {
    // Aggregate by date and assemble object { date, bp, weight, sugar }
    const map: Record<string, any> = {};
    HEALTH_METRICS0.forEach((m) => {
      if (!map[m.timestamp]) map[m.timestamp] = { date: m.timestamp };
      map[m.timestamp][m.type] = m.value;
    });
    return Object.values(map).sort((a, b) => (a.date > b.date ? 1 : -1));
  }, []);
  return (
    <div className="space-y-5">
      <Card className="p-4">
        <SectionTitle icon={Activity}>Health Tracker</SectionTitle>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--tw-colors-slate-200, #e2e8f0)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip wrapperClassName="!text-sm" />
              <Line type="monotone" dataKey="bp" name="BP" stroke="#14b8a6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="weight" name="Weight" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sugar" name="Sugar" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}