"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to the dashboard for now
    navigate("/dashboard/kpi");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-pulse">
        <h1 className="text-2xl font-semibold">Loading Admin Panel...</h1>
      </div>
    </div>
  );
};

export default Index;