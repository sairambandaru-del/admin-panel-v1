"use client";

import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import KPITracker from '@/components/dashboard/KPITracker';
import LogsTable from '@/components/dashboard/LogsTable';
import SystemAlerts from '@/components/dashboard/SystemAlerts';
import Communications from '@/components/dashboard/Communications';
import BookingsTable from '@/components/dashboard/BookingsTable';
import CorporateDirectories from '@/components/corporate/CorporateDirectories';
import EmployeeDirectory from '@/components/corporate/EmployeeDirectory';
import TravelPolicy from '@/components/corporate/TravelPolicy';
import ExpenseAuditing from '@/components/corporate/ExpenseAuditing';
import CustomEnquiries from '@/components/corporate/CustomEnquiries';
import AvailabilityCalendar from '@/components/inventory/AvailabilityCalendar';
import BookingReport from '@/components/inventory/BookingReport';
import UnitStatus from '@/components/inventory/UnitStatus';
import PMSSync from '@/components/inventory/PMSSync';
import BookingQuotation from '@/components/inventory/BookingQuotation';
import VendorRegistry from '@/components/vendors/VendorRegistry';
import VendorOnboarding from '@/components/vendors/VendorOnboarding';
import VendorServices from '@/components/vendors/VendorServices';
import VendorMarkup from '@/components/vendors/VendorMarkup';
import VendorInventory from '@/components/vendors/VendorInventory';
import VendorPerformance from '@/components/vendors/VendorPerformance';
import VendorSOA from '@/components/vendors/VendorSOA';
import Invoicing from '@/components/finance/Invoicing';
import Payouts from '@/components/finance/Payouts';
import Disputes from '@/components/finance/Disputes';
import SettingsUsers from '@/components/settings/SettingsUsers';
import SettingsAccounts from '@/components/settings/SettingsAccounts';
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

    // Corporate Ecosystem Section
    if (path === '/corporate/directories') return <CorporateDirectories />;
    if (path === '/corporate/employees') return <EmployeeDirectory />;
    if (path === '/corporate/policy') return <TravelPolicy />;
    if (path === '/corporate/auditing') return <ExpenseAuditing />;
    if (path === '/corporate/enquiries') return <CustomEnquiries />;

    // Unit Inventory Section
    if (path === '/inventory/calendar') return <AvailabilityCalendar />;
    if (path === '/inventory/bookings') return <BookingReport />;
    if (path === '/inventory/status') return <UnitStatus />;
    if (path === '/inventory/pms') return <PMSSync />;
    if (path === '/inventory/quotation') return <BookingQuotation />;

    // Vendors Section
    if (path === '/vendors/registry') return <VendorRegistry />;
    if (path === '/vendors/onboarding') return <VendorOnboarding />;
    if (path === '/vendors/services') return <VendorServices />;
    if (path === '/vendors/markup') return <VendorMarkup />;
    if (path === '/vendors/inventory') return <VendorInventory />;
    if (path === '/vendors/performance') return <VendorPerformance />;
    if (path === '/vendors/accounts') return <VendorSOA />;

    // Finance Section
    if (path === '/finance/invoicing') return <Invoicing />;
    if (path === '/finance/payouts') return <Payouts />;
    if (path === '/finance/disputes') return <Disputes />;

    // Settings Section
    if (path === '/settings/users') return <SettingsUsers />;
    if (path === '/settings/accounts') return <SettingsAccounts />;

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
    if (path.startsWith('/vendors')) return "Manage vendor registry, services, inventory, and performance.";
    if (path.startsWith('/finance')) return "Financial reporting, invoicing, and payout management.";
    if (path.startsWith('/settings')) return "System configuration, corporate boundaries, and user permissions.";
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