"use client";

import React, { useState, useEffect } from 'react';
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
  UserPlus,
  Truck,
  Star,
  Receipt,
  CreditCard,
  AlertCircle,
  Sparkles,
  Boxes,
  TrendingUp,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  items?: {
    title: string;
    href: string;
    icon?: React.ElementType;
  }[];
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
      { title: "Employee Directory", href: "/corporate/employees", icon: Users },
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
      { title: "Vendor Onboarding", href: "/vendors/onboarding", icon: UserPlus },
      { title: "Vendor Services", href: "/vendors/services", icon: Truck },
      { title: "Service Markups", href: "/vendors/markup", icon: TrendingUp },
      { title: "Inventory Management", href: "/vendors/inventory", icon: Boxes },
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
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('straizen_sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('straizen_sidebar_collapsed', isCollapsed ? 'true' : 'false');
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-screen border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out shrink-0 relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className={cn("border-b border-sidebar-border flex items-center transition-all duration-300", isCollapsed ? "p-3 justify-center" : "p-4 justify-between")}>
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight truncate">
              str<span className="text-primary">ai</span>zen
            </h1>
          </div>
        ) : (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(
                "h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent shrink-0",
                isCollapsed && "mt-1"
              )}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-primary" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? "Expand Panel" : "Collapse Panel"}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Navigation List */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-1.5">
          {navigation.map((section) => {
            const isCategoryActive = location.pathname.startsWith(section.href);
            const Icon = section.icon;

            if (isCollapsed) {
              // Collapsed state: Render DropdownMenu for section sub-items
              return (
                <div key={section.title} className="flex justify-center my-1">
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative group",
                              isCategoryActive
                                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-semibold">
                        {section.title}
                      </TooltipContent>
                    </Tooltip>

                    <DropdownMenuContent side="right" align="start" className="w-52 ml-2">
                      <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {section.title}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {section.items?.map((item) => {
                        const ItemIcon = item.icon;
                        const isSubActive = location.pathname === item.href;

                        return (
                          <DropdownMenuItem key={item.href} asChild>
                            <Link
                              to={item.href}
                              className={cn(
                                "flex items-center gap-2.5 text-xs font-medium cursor-pointer",
                                isSubActive && "text-primary font-bold bg-primary/10"
                              )}
                            >
                              {ItemIcon && <ItemIcon className="w-3.5 h-3.5 shrink-0" />}
                              <span>{item.title}</span>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            }

            // Expanded state: Render standard Collapsible section
            return (
              <Collapsible key={section.title} defaultOpen={isCategoryActive}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 text-sidebar-foreground/70 group-hover:text-primary shrink-0 transition-colors" />
                    <span className="font-medium text-xs truncate">{section.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-sidebar-foreground/50 transition-transform duration-200 group-data-[state=open]:rotate-90 shrink-0" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 mt-1 space-y-0.5">
                  {section.items?.map((item) => {
                    const ItemIcon = item.icon;
                    const isSubActive = location.pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-2.5 p-1.5 rounded-md text-[11px] transition-colors",
                          isSubActive 
                            ? "bg-primary text-primary-foreground font-semibold shadow-2xs" 
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        {ItemIcon && <ItemIcon className="w-3.5 h-3.5 shrink-0" />}
                        <span className="truncate">{item.title}</span>
                      </Link>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className={cn("border-t border-sidebar-border transition-all duration-300 text-sidebar-foreground/40 text-center uppercase tracking-widest text-[9px]", isCollapsed ? "p-2" : "p-3")}>
        {isCollapsed ? "v1.0" : "straizen admin v1.0"}
      </div>
    </div>
  );
};

export default AdminSidebar;