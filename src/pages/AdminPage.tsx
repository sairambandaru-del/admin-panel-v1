"use client";

import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import KPITracker from '@/components/dashboard/KPITracker';
import LogsTable from '@/components/dashboard/LogsTable';
import SystemAlerts from '@/components/dashboard/SystemAlerts';
import Communications from '@/components/dashboard/Communications';
import BookingsTable from '@/components/dashboard/BookingsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminPage = () => {
  const location = useLocation();
  const path = location.pathname;

  const renderContent = () => {
    // Dashboard Section
    if (path === '/dashboard/kpi') return <KPITracker />;
    if (path === '/dashboard/logs') return <LogsTable />;
    if (path === '/dashboard/alerts') return <SystemAlerts />;
    if (path === '/dashboard/comms') return <Communications />;
    if (path === '/dashboard/bookings') return <BookingsTable />;

    // Placeholder for other sections
    const pathParts = path.split('/').filter(Boolean);
    const section = pathParts[0]?.charAt(0).toUpperCase() + pathParts[0]?.slice(1);
    const subSection = pathParts[1]?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Section Content</CardTitle>
          <CardDescription>
            This is the placeholder for the {subSection || section} module.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg m-6">
          <div className="text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Module: {section} {subSection ? `> ${subSection}` : ''}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Ready for implementation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const getTitle = () => {
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length === 0) return "Admin Panel";
    
    const subSection = pathParts[1]?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const section = pathParts[0]?.charAt(0).toUpperCase() + pathParts[0]?.slice(1);
    
    return subSection || section;
  };

  const getDescription = () => {
    if (path.startsWith('/dashboard')) return "Overview of performance and operations for the Straizen team.";
    if (path.startsWith('/corporate')) return "Manage corporate accounts, policies, and travel auditing.";
    if (path.startsWith('/inventory')) return "Track unit availability, status, and PMS synchronization.";
    if (path.startsWith('/vendors')) return "Manage vendor registry, services, and performance.";
    if (path.startsWith('/finance')) return "Financial reporting, invoicing, and payout management.";
    if (path.startsWith('/settings')) return "System configuration and user management.";
    return "Manage your platform here.";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{getTitle()}</h2>
          <p className="text-muted-foreground">{getDescription()}</p>
        </div>
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default AdminPage;