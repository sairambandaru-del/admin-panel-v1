"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const integrations = [
  { id: 1, name: 'Cloudbeds', status: 'Connected', lastSync: '2 mins ago', units: 45, health: 'Healthy' },
  { id: 2, name: 'Mews', status: 'Connected', lastSync: '15 mins ago', units: 32, health: 'Healthy' },
  { id: 3, name: 'Hostaway', status: 'Syncing', lastSync: 'Just now', units: 28, health: 'Warning' },
  { id: 4, name: 'Guesty', status: 'Disconnected', lastSync: '2 days ago', units: 19, health: 'Critical' },
];

const PMSSync = () => {
  const handleSync = (name: string) => {
    showSuccess(`Manual sync triggered for ${name}.`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {integrations.map((pms) => (
        <Card key={pms.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">{pms.name}</CardTitle>
              <CardDescription>Integration Status</CardDescription>
            </div>
            <Badge variant={
              pms.health === 'Healthy' ? 'default' : 
              pms.health === 'Warning' ? 'secondary' : 'destructive'
            }>
              {pms.health}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">Status</p>
                <div className="flex items-center gap-2">
                  {pms.status === 'Connected' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-sm font-medium">{pms.status}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">Last Sync</p>
                <p className="text-sm font-medium">{pms.lastSync}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">Units Synced</p>
                <p className="text-sm font-medium">{pms.units} Units</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase">API Health</p>
                <p className="text-sm font-medium">99.9% Uptime</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 gap-2"
                onClick={() => handleSync(pms.name)}
              >
                <RefreshCw className="w-4 h-4" /> Sync Now
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" /> Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PMSSync;