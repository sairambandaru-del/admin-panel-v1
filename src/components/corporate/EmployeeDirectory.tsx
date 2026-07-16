"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Building2, 
  ShieldCheck, 
  Plane, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Sliders, 
  Briefcase, 
  Heart, 
  MapPin, 
  Calendar, 
  DollarSign 
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface Trip {
  id: string;
  destination: string;
  dates: string;
  purpose: string;
  cost: number;
  status: 'Upcoming' | 'Active' | 'Completed';
}

interface ApprovalRequest {
  id: string;
  destination: string;
  dates: string;
  cost: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined';
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  company: string;
  avatar: string;
  preferences: {
    dietary: string;
    seat: string;
    roomType: string;
    airline: string;
  };
  policy: {
    maxBudget: number;
    cabinClass: string;
    autoApprove: boolean;
    requiresApproval: boolean;
  };
  trips: Trip[];
  approvals: ApprovalRequest[];
}

const initialEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'John Doe',
    email: 'john.doe@techcorp.com',
    role: 'Product Manager',
    department: 'Product & Engineering',
    company: 'TechCorp Solutions',
    avatar: 'JD',
    preferences: {
      dietary: 'Vegetarian',
      seat: 'Window',
      roomType: 'King Bed',
      airline: 'Delta Airlines'
    },
    policy: {
      maxBudget: 300,
      cabinClass: 'Premium Economy',
      autoApprove: true,
      requiresApproval: false
    },
    trips: [
      { id: 'TRP-101', destination: 'London, UK', dates: 'Jun 12 - Jun 18, 2024', purpose: 'Q2 Product Sync', cost: 1450, status: 'Upcoming' },
      { id: 'TRP-102', destination: 'San Francisco, USA', dates: 'Mar 04 - Mar 10, 2024', purpose: 'Tech Summit', cost: 2100, status: 'Completed' }
    ],
    approvals: [
      { id: 'APR-201', destination: 'Tokyo, Japan', dates: 'Sep 15 - Sep 22, 2024', cost: 3200, reason: 'Partner Conference', status: 'Pending' }
    ]
  },
  {
    id: 'EMP-002',
    name: 'Jane Smith',
    email: 'jane.smith@globallogistics.com',
    role: 'Sales Director',
    department: 'Global Sales',
    company: 'Global Logistics Inc',
    avatar: 'JS',
    preferences: {
      dietary: 'None',
      seat: 'Aisle',
      roomType: 'Double Queen',
      airline: 'United Airlines'
    },
    policy: {
      maxBudget: 450,
      cabinClass: 'Business Class',
      autoApprove: false,
      requiresApproval: true
    },
    trips: [
      { id: 'TRP-103', destination: 'New York, USA', dates: 'May 25 - May 29, 2024', purpose: 'Enterprise Client Pitch', cost: 1850, status: 'Upcoming' }
    ],
    approvals: []
  },
  {
    id: 'EMP-003',
    name: 'Mike Ross',
    email: 'mike.ross@innovate.com',
    role: 'Marketing Associate',
    department: 'Growth Marketing',
    company: 'Innovate Media',
    avatar: 'MR',
    preferences: {
      dietary: 'Gluten-Free',
      seat: 'Window',
      roomType: 'Standard King',
      airline: 'Emirates'
    },
    policy: {
      maxBudget: 200,
      cabinClass: 'Economy',
      autoApprove: true,
      requiresApproval: false
    },
    trips: [],
    approvals: [
      { id: 'APR-202', destination: 'Chicago, USA', dates: 'Jul 10 - Jul 14, 2024', cost: 850, reason: 'Marketing Workshop', status: 'Pending' }
    ]
  }
];

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmpId, setSelectedEmpId] = useState<string>(initialEmployees[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedEmployee = employees.find(emp => emp.id === selectedEmpId) || employees[0];

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess(`Preferences updated for ${selectedEmployee.name}.`);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess(`Individual travel policy overrides saved for ${selectedEmployee.name}.`);
  };

  const handleApprovalAction = (empId: string, reqId: string, action: 'Approved' | 'Declined') => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId) {
        return {
          ...emp,
          approvals: emp.approvals.map(app => 
            app.id === reqId ? { ...app, status: action } : app
          )
        };
      }
      return emp;
    }));

    if (action === 'Approved') {
      showSuccess(`Travel request ${reqId} approved.`);
    } else {
      showError(`Travel request ${reqId} declined.`);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {/* Left Sidebar: Employee List */}
      <Card className="md:col-span-1 flex flex-col h-[calc(100vh-220px)]">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">Employees</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search employees..." 
              className="pl-8 h-9 text-xs" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-y-auto">
          <div className="divide-y">
            {filteredEmployees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => setSelectedEmpId(emp.id)}
                className={`w-full text-left p-4 hover:bg-accent transition-colors flex items-center gap-3 ${selectedEmpId === emp.id ? 'bg-accent' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {emp.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{emp.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{emp.role}</p>
                  <Badge variant="outline" className="mt-1 text-[9px] h-4 px-1 font-normal">
                    {emp.company}
                  </Badge>
                </div>
              </button>
            ))}
            {filteredEmployees.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No employees found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right Main Content: Employee Details & Management */}
      <Card className="md:col-span-3 flex flex-col h-[calc(100vh-220px)] overflow-y-auto">
        <CardHeader className="border-b p-6 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
              {selectedEmployee.avatar}
            </div>
            <div>
              <CardTitle className="text-xl">{selectedEmployee.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Briefcase className="w-3.5 h-3.5" /> {selectedEmployee.role} • {selectedEmployee.department}
              </CardDescription>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedEmployee.email}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-xs px-2.5 py-0.5">
              {selectedEmployee.company}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="profile" className="flex gap-2">
                <User className="w-4 h-4" /> Profile & Preferences
              </TabsTrigger>
              <TabsTrigger value="policy" className="flex gap-2">
                <Sliders className="w-4 h-4" /> Travel Policy
              </TabsTrigger>
              <TabsTrigger value="trips" className="flex gap-2">
                <Plane className="w-4 h-4" /> Active Trips
              </TabsTrigger>
              <TabsTrigger value="approvals" className="flex gap-2">
                <ShieldCheck className="w-4 h-4" /> Approvals
                {selectedEmployee.approvals.filter(a => a.status === 'Pending').length > 0 && (
                  <span className="ml-1.5 w-2 h-2 bg-destructive rounded-full" />
                )}
              </TabsTrigger>
            </TabsList>

            {/* Profile & Preferences Tab */}
            <TabsContent value="profile" className="space-y-6">
              <form onSubmit={handleSavePreferences} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
                      <User className="w-4 h-4" /> Basic Information
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="emp-name">Full Name</Label>
                      <Input id="emp-name" defaultValue={selectedEmployee.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emp-email">Email Address</Label>
                      <Input id="emp-email" defaultValue={selectedEmployee.email} type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emp-role">Functional Role</Label>
                      <Input id="emp-role" defaultValue={selectedEmployee.role} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
                      <Heart className="w-4 h-4" /> Travel Preferences
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="pref-diet">Dietary Requirements</Label>
                      <Input id="pref-diet" defaultValue={selectedEmployee.preferences.dietary} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pref-seat">Flight Seat Preference</Label>
                      <Input id="pref-seat" defaultValue={selectedEmployee.preferences.seat} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pref-room">Hotel Room Preference</Label>
                      <Input id="pref-room" defaultValue={selectedEmployee.preferences.roomType} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pref-airline">Preferred Airline</Label>
                      <Input id="pref-airline" defaultValue={selectedEmployee.preferences.airline} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button type="submit">Save Profile & Preferences</Button>
                </div>
              </form>
            </TabsContent>

            {/* Travel Policy Tab */}
            <TabsContent value="policy" className="space-y-6">
              <form onSubmit={handleSavePolicy} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary">Individual Policy Overrides</h3>
                  <p className="text-xs text-muted-foreground">
                    Configure custom travel rules that override the global corporate policy for this specific employee.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Max Budget per Night</Label>
                        <p className="text-xs text-muted-foreground">Limit the maximum cost for accommodation.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">$</span>
                        <Input className="w-24 h-8" defaultValue={selectedEmployee.policy.maxBudget.toString()} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Allowed Cabin Class</Label>
                        <p className="text-xs text-muted-foreground">Maximum allowed flight class.</p>
                      </div>
                      <Input className="w-40 h-8" defaultValue={selectedEmployee.policy.cabinClass} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Auto-Approve Trips</Label>
                        <p className="text-xs text-muted-foreground">Automatically approve bookings within budget.</p>
                      </div>
                      <Switch defaultChecked={selectedEmployee.policy.autoApprove} />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Requires Manager Approval</Label>
                        <p className="text-xs text-muted-foreground">Force manual approval for all bookings.</p>
                      </div>
                      <Switch defaultChecked={selectedEmployee.policy.requiresApproval} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button type="submit">Save Policy Overrides</Button>
                </div>
              </form>
            </TabsContent>

            {/* Active Trips Tab */}
            <TabsContent value="trips" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destination</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Estimated Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEmployee.trips.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            {trip.destination}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                            {trip.dates}
                          </div>
                        </TableCell>
                        <TableCell>{trip.purpose}</TableCell>
                        <TableCell className="font-semibold">${trip.cost}</TableCell>
                        <TableCell>
                          <Badge variant={
                            trip.status === 'Active' ? 'default' : 
                            trip.status === 'Upcoming' ? 'secondary' : 'outline'
                          }>
                            {trip.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedEmployee.trips.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          No active or upcoming trips found for this employee.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Approvals Tab */}
            <TabsContent value="approvals" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Estimated Cost</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEmployee.approvals.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-bold">{req.id}</TableCell>
                        <TableCell className="font-semibold">{req.destination}</TableCell>
                        <TableCell>{req.dates}</TableCell>
                        <TableCell className="font-semibold text-primary">${req.cost}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={req.reason}>
                          {req.reason}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            req.status === 'Approved' ? 'default' : 
                            req.status === 'Declined' ? 'destructive' : 'secondary'
                          }>
                            {req.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {req.status === 'Pending' ? (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleApprovalAction(selectedEmployee.id, req.id, 'Approved')}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleApprovalAction(selectedEmployee.id, req.id, 'Declined')}
                              >
                                Decline
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Processed</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedEmployee.approvals.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No pending travel approval requests for this employee.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDirectory;