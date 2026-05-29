"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Plus, Edit2, ShieldAlert, Power, HelpCircle } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { usePlatformData, PlatformUser } from '@/context/PlatformDataContext';
import { AVAILABLE_MODULES } from './SettingsAccounts';

const SettingsUsers = () => {
  const { accounts, users, addUser, updateUser, toggleUserStatus } = usePlatformData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    accountId: accounts[0]?.id || '',
    customPermissions: [] as string[]
  });

  const [editingUser, setEditingUser] = useState<PlatformUser | null>(null);

  // Helper: Get active allowed modules of selected account
  const getSelectedAccountModules = (accId: string): string[] => {
    const acc = accounts.find(a => a.id === accId);
    return acc ? acc.allowedModules : [];
  };

  const handleAccountChange = (accId: string) => {
    const accModules = getSelectedAccountModules(accId);
    setFormData(prev => ({
      ...prev,
      accountId: accId,
      customPermissions: accModules.includes('dashboard') ? ['dashboard'] : []
    }));
  };

  const handleTogglePermission = (permissionId: string) => {
    setFormData(prev => {
      const parentModules = getSelectedAccountModules(prev.accountId);
      if (!parentModules.includes(permissionId)) {
        showError("Permission blocked: This capability is disabled for the parent Account.");
        return prev;
      }

      return {
        ...prev,
        customPermissions: prev.customPermissions.includes(permissionId)
          ? prev.customPermissions.filter(p => p !== permissionId)
          : [...prev.customPermissions, permissionId]
      };
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      accountId: formData.accountId,
      customPermissions: formData.customPermissions
    });

    setIsCreateOpen(false);
    setFormData({
      name: '',
      email: '',
      role: '',
      accountId: accounts[0]?.id || '',
      customPermissions: []
    });
    showSuccess(`User "${created.name}" successfully provisioned.`);
  };

  const handleToggleStatus = (id: string, name: string) => {
    toggleUserStatus(id);
    showSuccess(`Status changed for user "${name}".`);
  };

  const handleEditClick = (user: PlatformUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      accountId: user.accountId,
      customPermissions: user.customPermissions
    });
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser({
      ...editingUser,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      accountId: formData.accountId,
      customPermissions: formData.customPermissions
    });

    setIsEditOpen(false);
    setEditingUser(null);
    showSuccess(`User permissions and details updated successfully.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">User Directory</h3>
          <p className="text-sm text-muted-foreground">Manage user identities and override specific system access permissions.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={accounts.length === 0}>
              <Plus className="w-4 h-4" /> Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Provision New User</DialogTitle>
                <DialogDescription>
                  Enter details and select a parent organization. User's permission boundaries are inherited from the selected account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="Jane Doe" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    placeholder="jane@company.com" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Functional Role</Label>
                    <Input 
                      id="role" 
                      value={formData.role} 
                      onChange={e => setFormData({...formData, role: e.target.value})} 
                      placeholder="e.g. Account Manager" 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="account">Parent Account Partner</Label>
                    <Select 
                      value={formData.accountId} 
                      onValueChange={handleAccountChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(acc => (
                          <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-sm font-semibold flex items-center gap-1">
                    System Permission Overrides
                  </Label>
                  <p className="text-xs text-muted-foreground bg-accent/30 p-2 rounded border border-dashed flex items-start gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                    <span>Grayed out options indicate permissions disabled by the parent Account.</span>
                  </p>
                  
                  <div className="space-y-2 border rounded-lg p-3 bg-muted/20">
                    {AVAILABLE_MODULES.map(module => {
                      const isAllowedByAccount = getSelectedAccountModules(formData.accountId).includes(module.id);
                      return (
                        <div key={module.id} className={`flex items-center space-x-2 ${!isAllowedByAccount ? 'opacity-40' : ''}`}>
                          <Checkbox 
                            id={`perm-${module.id}`} 
                            checked={formData.customPermissions.includes(module.id) && isAllowedByAccount}
                            disabled={!isAllowedByAccount}
                            onCheckedChange={() => handleTogglePermission(module.id)}
                          />
                          <Label 
                            htmlFor={`perm-${module.id}`} 
                            className={`text-sm font-normal ${isAllowedByAccount ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                          >
                            {module.label}
                            {!isAllowedByAccount && (
                              <span className="text-[10px] text-destructive-foreground ml-2 px-1 py-0.5 rounded bg-destructive/10 font-bold uppercase">
                                Restricted by Account
                              </span>
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Save User Profile</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Belongs To Account</TableHead>
                <TableHead>Allowed Scopes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => {
                const account = accounts.find(a => a.id === user.accountId);
                return (
                  <TableRow key={user.id} className={user.status === 'Inactive' ? 'opacity-60' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-xs">{account?.name || 'Unknown'}</span>
                        <Badge variant="outline" className="text-[9px] h-4 w-fit py-0 capitalize">
                          {account?.type || 'N/A'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[280px]">
                        {user.customPermissions.map(mId => (
                          <Badge key={mId} variant="outline" className="text-[10px] py-0 px-1.5 capitalize bg-primary/5">
                            {AVAILABLE_MODULES.find(m => m.id === mId)?.label || mId}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)} title="Edit Permissions">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleStatus(user.id, user.name)} 
                          title={user.status === 'Active' ? "Deactivate User" : "Activate User"}
                          className={user.status === 'Active' ? "text-destructive hover:text-destructive" : "text-green-600 hover:text-green-600"}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[450px]">
          {editingUser && (
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Edit User Boundary: {formData.name}</DialogTitle>
                <DialogDescription>
                  Modify the functional scopes for this user. System restrictions apply dynamically based on their company.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input 
                    id="edit-name" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Work Email</Label>
                  <Input 
                    id="edit-email" 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-role">Functional Role</Label>
                    <Input 
                      id="edit-role" 
                      value={formData.role} 
                      onChange={e => setFormData({...formData, role: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-account">Parent Account Partner</Label>
                    <Select 
                      value={formData.accountId} 
                      onValueChange={handleAccountChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(acc => (
                          <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-sm font-semibold flex items-center gap-1">
                    System Permission Overrides
                  </Label>
                  <p className="text-xs text-muted-foreground bg-accent/30 p-2 rounded border border-dashed flex items-start gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                    <span>Restrictions update dynamically when the parent organization limits are changed.</span>
                  </p>
                  
                  <div className="space-y-2 border rounded-lg p-3 bg-muted/20">
                    {AVAILABLE_MODULES.map(module => {
                      const isAllowedByAccount = getSelectedAccountModules(formData.accountId).includes(module.id);
                      return (
                        <div key={module.id} className={`flex items-center space-x-2 ${!isAllowedByAccount ? 'opacity-40' : ''}`}>
                          <Checkbox 
                            id={`edit-perm-${module.id}`} 
                            checked={formData.customPermissions.includes(module.id) && isAllowedByAccount}
                            disabled={!isAllowedByAccount}
                            onCheckedChange={() => handleTogglePermission(module.id)}
                          />
                          <Label 
                            htmlFor={`edit-perm-${module.id}`} 
                            className={`text-sm font-normal ${isAllowedByAccount ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                          >
                            {module.label}
                            {!isAllowedByAccount && (
                              <span className="text-[10px] text-destructive-foreground ml-2 px-1 py-0.5 rounded bg-destructive/10 font-bold uppercase">
                                Restricted by Account
                              </span>
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Update Permission Profile</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsUsers;