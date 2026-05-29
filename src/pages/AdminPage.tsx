"use client";

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AdminLayout from '@/components/AdminLayout';

const AdminPage = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const section = pathParts[0]?.charAt(0).toUpperCase() + pathParts[0]?.slice(1);
  const subSection = pathParts[1]?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{subSection || section}</h2>
          <p className="text-muted-foreground">
            Manage your {subSection?.toLowerCase() || section?.toLowerCase()} here.
          </p>
        </div>

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
      </div>
    </AdminLayout>
  );
};

export default AdminPage;