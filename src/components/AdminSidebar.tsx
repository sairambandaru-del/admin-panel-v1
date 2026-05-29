"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Warehouse, 
  Users, 
  BadgeDollarSign, 
  Settings,
  ChevronRight,
  BarChart3,
  History,
  AlertTriangle,
  MessageSquare,
  CalendarCheck,
  BookOpen,
  ShieldCheck,
  ClipboardCheck,
  HelpCircle,
  Calendar,
  FileText,
  Activity,
  RefreshCw,
  Quote,
  UserCheck,
  Truck,
  Star,
  Receipt,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
  items?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    items: [
      { title: "KPI Tracker", href: "/dashboard/kpi", icon: BarChart3 },
      { title: "Logs", href: "/dashboard/logs", icon: History },
      { title: "System Alerts", href: "/dashboard/alerts", icon: AlertTriangle },
      { title: "Communications", href: "/dashboard/comms", icon: MessageSquare },
      { title: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
    ]
  },
  {
    title: "Corporate Ecosystem",
    href: "/corporate",
    icon: Building2,
    items: [
      { title: "Directories", href: "/corporate/directories", icon: BookOpen },
      { title: "Travel Policy", href: "/corporate/policy", icon: ShieldCheck },
      { title: "Auditing & Approval", href: "/corporate/auditing", icon: ClipboardCheck },
      { title: "Custom Enquiries", href: "/corporate/enquiries", icon: HelpCircle },
    ]
  },
  {
    title: "Unit Inventory",
    href: "/inventory",
    icon: Warehouse,
    items: [
      { title: "Availability Calendar", href: "/inventory/calendar", icon: Calendar },
      { title: "Booking Report", href: "/inventory/bookings", icon: FileText },
      { title: "Unit Status", href: "/inventory/status", icon: Activity },
      { title: "PMS Sync", href: "/inventory/pms", icon: RefreshCw },
      { title: "Booking Quotation", href: "/inventory/quotation", icon: Quote },
    ]
  },
  {
    title: "Vendors",
    href: "/vendors",
    icon: Users,
    items: [
      { title: "Registry & KYC", href: "/vendors/registry", icon: UserCheck },
      { title: "Vendor Services", href: "/vendors/services", icon: Truck },
      { title: "Performance", href: "/vendors/performance", icon: Star },
      { title: "Statement of Accounts", href: "/vendors/accounts", icon: Receipt },
    ]
  },
  {
    title: "Financial Reporting",
    href: "/finance",
    icon: BadgeDollarSign,
    items: [
      { title: "Invoicing", href: "/finance/invoicing", icon: Receipt },
      { title: "Payouts", href: "/finance/payouts", icon: CreditCard },
      { title: "Disputes", href: "/finance/disputes", icon: AlertCircle },
    ]
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    items: [
      { title: "Users", href: "/settings/users", icon: Users },
      { title: "Accounts", href: "/settings/accounts", icon: Building2 },
    ]
  }
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen w-64 border-r bg-card text-card-foreground">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold tracking-tight text-primary">Company Admin</h1>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((section) => (
            <Collapsible key={section.title} defaultOpen={location.pathname.startsWith(section.href)}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-accent transition-colors group">
                <div className="flex items-center gap-3">
                  {section.icon && <section.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />}
                  <span className="font-medium">{section.title}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-9 mt-1 space-y-1">
                {section.items?.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-md text-sm transition-colors",
                      location.pathname === item.href 
                        ? "bg-primary text-primary-foreground font-medium" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.title}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t text-xs text-muted-foreground text-center">
        v1.0.0 Admin Panel
      </div>
    </div>
  );
};

export default AdminSidebar;