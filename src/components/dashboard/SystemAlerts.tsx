"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Clock, User } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const initialAlerts = [
  { id: 'TKT-001', issue: 'Water Leakage', vendor: 'AquaFix Services', priority: 'High', status: 'Open', assignedTo: 'John Doe' },
  { id: 'TKT-002', issue: 'AC Not Working', vendor: 'CoolAir Pro', priority: 'Medium', status: 'In Progress', assignedTo: 'Sarah Smith' },
  { id: 'TKT-003', issue: 'Late Check-in Delay', vendor: 'FrontDesk Team', priority: 'Low', status: 'Open', assignedTo: 'Unassigned' },
  { id: 'TKT-004', issue: 'Payment Failure', vendor: 'Finance Dept', priority: 'High', status: 'Resolved', assignedTo: 'Mike Ross' },
];

const SystemAlerts = () => {
  const [alerts, setAlerts] = useState(initialAlerts);

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: 'Resolved' } : alert
    ));
    showSuccess(`Ticket ${id} marked as resolved.`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-bold">{alert.id}</TableCell>
                <TableCell>{alert.issue}</TableCell>
                <TableCell>{alert.vendor}</TableCell>
                <TableCell>
                  <Badge variant={alert.priority === 'High' ? 'destructive' : 'secondary'}>
                    {alert.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {alert.assignedTo}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {alert.status === 'Resolved' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : alert.status === 'In Progress' ? (
                      <Clock className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    {alert.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {alert.status !== 'Resolved' && (
                    <Button size="sm" variant="outline" onClick={() => handleResolve(alert.id)}>
                      Resolve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SystemAlerts;