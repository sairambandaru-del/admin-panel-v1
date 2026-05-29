"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

const logs = [
  { id: '1', user: 'Admin Sarah', action: 'Updated Pricing', target: 'Unit #402', timestamp: '2024-05-20 14:30:00', status: 'Success' },
  { id: '2', user: 'System', action: 'PMS Sync', target: 'Global Inventory', timestamp: '2024-05-20 14:15:00', status: 'Success' },
  { id: '3', user: 'Vendor John', action: 'Uploaded KYC', target: 'Vendor Profile', timestamp: '2024-05-20 13:45:00', status: 'Pending' },
  { id: '4', user: 'Admin Mike', action: 'Resolved Alert', target: 'Ticket #882', timestamp: '2024-05-20 12:30:00', status: 'Success' },
  { id: '5', user: 'System', action: 'Auto-Escalation', target: 'Booking #9921', timestamp: '2024-05-20 11:00:00', status: 'Warning' },
];

const LogsTable = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search logs..." className="h-9" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs font-mono">{log.timestamp}</TableCell>
                <TableCell className="font-medium">{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.target}</TableCell>
                <TableCell>
                  <Badge variant={log.status === 'Success' ? 'default' : log.status === 'Warning' ? 'destructive' : 'secondary'}>
                    {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LogsTable;