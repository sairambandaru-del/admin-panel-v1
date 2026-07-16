"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, DollarSign, MapPin } from 'lucide-react';

const units = [
  { id: 'U-101', name: 'Skyline Suite 101', location: 'Downtown', type: '2BR', price: 250, status: 'Available', pms: 'Cloudbeds' },
  { id: 'U-102', name: 'Ocean View 102', location: 'Beachfront', type: '1BR', price: 180, status: 'Occupied', pms: 'Mews' },
  { id: 'U-103', name: 'Garden Villa 103', location: 'Suburbs', type: '3BR', price: 450, status: 'Available', pms: 'Cloudbeds' },
  { id: 'U-104', name: 'Urban Loft 104', location: 'Downtown', type: 'Studio', price: 150, status: 'Maintenance', pms: 'Hostaway' },
  { id: 'U-105', name: 'Mountain Cabin 105', location: 'Highlands', type: '2BR', price: 320, status: 'Available', pms: 'Mews' },
];

const UnitStatus = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">Across 12 locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED 285.50</div>
            <p className="text-xs text-muted-foreground">+5.2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Current live status</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unit Status & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Daily Price</TableHead>
                <TableHead>PMS Source</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-mono text-xs">{unit.id}</TableCell>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      {unit.location}
                    </div>
                  </TableCell>
                  <TableCell>{unit.type}</TableCell>
                  <TableCell className="font-semibold text-primary">AED {unit.price}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">{unit.pms}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      unit.status === 'Available' ? 'default' : 
                      unit.status === 'Occupied' ? 'secondary' : 'destructive'
                    }>
                      {unit.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitStatus;