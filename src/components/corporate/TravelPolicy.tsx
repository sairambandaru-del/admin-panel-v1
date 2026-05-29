"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Globe, User, Save, Plus } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const TravelPolicy = () => {
  const handleSave = () => {
    showSuccess("Policy rules updated successfully.");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="global">
        <TabsList className="mb-4">
          <TabsTrigger value="global" className="flex gap-2">
            <Globe className="w-4 h-4" /> Global Policy
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex gap-2">
            <User className="w-4 h-4" /> Individual Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Global Rules Engine</CardTitle>
              <CardDescription>These rules apply to all employees within the corporate account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Max Budget per Night</Label>
                      <p className="text-xs text-muted-foreground">Limit the maximum cost for accommodation.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">$</span>
                      <Input className="w-24 h-8" defaultValue="250" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Business Class Travel</Label>
                      <p className="text-xs text-muted-foreground">Allow business class for flights over 6 hours.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Advance Booking Required</Label>
                      <p className="text-xs text-muted-foreground">Minimum days before trip to book.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input className="w-24 h-8" defaultValue="14" />
                      <span className="text-sm font-medium">Days</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Auto-Approval Threshold</Label>
                      <p className="text-xs text-muted-foreground">Approve trips below this total amount.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">$</span>
                      <Input className="w-24 h-8" defaultValue="1500" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" /> Save Global Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Individual Overrides</CardTitle>
              <CardDescription>Set specific rules for individual employees (e.g., Executives).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 max-w-md">
                <Input placeholder="Search employee by name or ID..." />
                <Button variant="secondary">Search</Button>
              </div>
              
              <div className="border rounded-lg p-8 text-center bg-muted/30">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium">No Employee Selected</h4>
                <p className="text-sm text-muted-foreground mt-1">Search for an employee to manage their individual travel rules.</p>
                <Button variant="outline" className="mt-4 gap-2">
                  <Plus className="w-4 h-4" /> Add New Override
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelPolicy;