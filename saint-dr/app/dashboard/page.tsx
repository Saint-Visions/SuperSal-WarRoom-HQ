"use client";
import React from "react";
import WorkspaceRealtimeDashboard from "@/components/WorkspaceRealtimeDashboard";
import MemoryPingBoard from "@/components/MemoryPingBoard";

export default function DashboardPage() {
  return (
    <main className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Saint~Dr.™ Control Dashboard</h1>
      
      <WorkspaceRealtimeDashboard />
      
      <MemoryPingBoard />
    </main>
  );
}
