"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Send, 
  User, 
  Building2, 
  Calendar, 
  Clock, 
  Lock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

export interface ServiceException {
  id: string;
  reason: string;
  details: string;
  originalCost: number;
  proposedCost: number;
  status: 'Pending Guest Approval' | 'Approved' | 'Declined';
  createdAt: string;
}

export interface BookingCommsData {
  id: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  propertyName?: string;
  serviceCategory?: string;
  dates?: string;
  status?: string;
  pendingException?: ServiceException | null;
  onApproveException?: (bookingId: string, newCost: number) => void;
  onDeclineException?: (bookingId: string) => void;
}

interface Message {
  id: string;
  sender: 'Guest' | 'Host/Admin' | 'Vendor' | 'System';
  senderName: string;
  text: string;
  timestamp: string;
  isInternal?: boolean;
  isExceptionCard?: boolean;
  exceptionData?: ServiceException;
}

interface GuestCommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingCommsData | null;
}

// Generate context-aware mock messages based on booking data
const getMockMessages = (booking: BookingCommsData | null): Message[] => {
  if (!booking) return [];

  const category = booking.serviceCategory || 'Short Term Rentals';
  const name = booking.guestName || 'Guest';

  const messagesByCategory: Record<string, Message[]> = {
    'Laundry': [
      {
        id: '1',
        sender: 'System',
        senderName: 'Straizen System',
        text: `Laundry service order ${booking.id} dispatched to QuickWash Laundry. Picked up from unit.`,
        timestamp: 'May 21, 10:00 AM'
      },
      {
        id: '2',
        sender: 'Guest',
        senderName: name,
        text: `Hi! Please make sure the silk shirts are dry cleaned on low heat. Thank you!`,
        timestamp: 'May 21, 10:15 AM'
      },
      {
        id: '3',
        sender: 'Vendor',
        senderName: 'QuickWash Laundry Specialist',
        text: `Hello ${name.split(' ')[0]}. We received your laundry bag. Our team is inspecting the items now.`,
        timestamp: 'May 21, 10:30 AM'
      }
    ],
    'Short Term Rentals': [
      {
        id: '1',
        sender: 'System',
        senderName: 'Straizen System',
        text: `Booking ${booking.id} confirmed for ${name}. Early check-in requested.`,
        timestamp: 'May 18, 09:15 AM'
      },
      {
        id: '2',
        sender: 'Guest',
        senderName: name,
        text: `Hi! Is it possible to check in around 1:00 PM instead of 3:00 PM? Our flight lands early in the morning.`,
        timestamp: 'May 18, 10:30 AM'
      },
      {
        id: '3',
        sender: 'Host/Admin',
        senderName: 'Straizen Support',
        text: `Hello ${name.split(' ')[0]}! We'll do our best to accommodate. Keycode will be activated at 12:30 PM.`,
        timestamp: 'May 18, 11:05 AM'
      }
    ]
  };

  const initialMsgs = messagesByCategory[category] || [
    {
      id: '1',
      sender: 'System',
      senderName: 'Straizen System',
      text: `Booking ${booking.id} created for guest ${name}.`,
      timestamp: 'May 18, 08:00 AM'
    },
    {
      id: '2',
      sender: 'Guest',
      senderName: name,
      text: `Hi! Looking forward to our service booking.`,
      timestamp: 'May 18, 09:30 AM'
    }
  ];

  return initialMsgs;
};

export const GuestCommunicationModal: React.FC<GuestCommunicationModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  if (!booking) return null;

  const [messages, setMessages] = useState<Message[]>(getMockMessages(booking));
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'guest' | 'internal'>('guest');
  const [activeException, setActiveException] = useState<ServiceException | null>(
    booking.pendingException || null
  );

  // Sync state when booking changes
  React.useEffect(() => {
    setMessages(getMockMessages(booking));
    setActiveException(booking.pendingException || null);
  }, [booking?.id, booking?.pendingException]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newEntry: Message = {
      id: Date.now().toString(),
      sender: 'Host/Admin',
      senderName: activeTab === 'internal' ? 'Admin Note' : 'Straizen Support',
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInternal: activeTab === 'internal'
    };

    setMessages(prev => [...prev, newEntry]);
    setNewMessage('');
    showSuccess(activeTab === 'internal' ? 'Internal note added' : 'Message sent to guest');
  };

  const handleGuestApproveException = () => {
    if (!activeException || !booking) return;

    const newCost = activeException.proposedCost;

    // 1. Update internal state
    const updatedException: ServiceException = {
      ...activeException,
      status: 'Approved'
    };
    setActiveException(updatedException);

    // 2. Add confirmation message to the chat
    const confirmMsg: Message = {
      id: Date.now().toString(),
      sender: 'Guest',
      senderName: booking.guestName,
      text: `✅ Price adjustment approved for AED ${newCost.toFixed(2)}. Please proceed with the service.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const vendorNotifyMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'System',
      senderName: 'Straizen System',
      text: `Update sent to Vendor: Guest approved the revised price of AED ${newCost.toFixed(2)}. Service booking updated.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, confirmMsg, vendorNotifyMsg]);

    // 3. Trigger parent callback
    if (booking.onApproveException) {
      booking.onApproveException(booking.id, newCost);
    }

    showSuccess(`Guest approved revised price of AED ${newCost.toFixed(2)}. Vendor notified!`);
  };

  const handleGuestDeclineException = () => {
    if (!activeException || !booking) return;

    const updatedException: ServiceException = {
      ...activeException,
      status: 'Declined'
    };
    setActiveException(updatedException);

    const declineMsg: Message = {
      id: Date.now().toString(),
      sender: 'Guest',
      senderName: booking.guestName,
      text: `❌ Price adjustment declined. Please proceed with original service scope or contact me.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const vendorNotifyMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'System',
      senderName: 'Straizen System',
      text: `Update sent to Vendor: Guest declined price adjustment. Original booking price maintained.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, declineMsg, vendorNotifyMsg]);

    if (booking.onDeclineException) {
      booking.onDeclineException(booking.id);
    }

    showError(`Price revision request declined. Vendor notified.`);
  };

  const visibleMessages = messages.filter(m => activeTab === 'internal' ? true : !m.isInternal);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header Section */}
        <DialogHeader className="p-4 border-b bg-muted/20 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Guest Communications
                </DialogTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {booking.id}
                </Badge>
              </div>
              <DialogDescription className="text-xs">
                Mobile Guest App Sync & Vendor Service Communication Thread
              </DialogDescription>
            </div>
            {booking.status && (
              <Badge variant={
                booking.status === 'Confirmed' || booking.status === 'Completed' ? 'default' :
                booking.status === 'In Progress' ? 'secondary' : 'outline'
              }>
                {booking.status}
              </Badge>
            )}
          </div>

          {/* Guest & Property Quick Details Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold text-foreground truncate">{booking.guestName}</span>
            </div>
            {booking.propertyName && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span className="truncate">{booking.propertyName}</span>
              </div>
            )}
            {booking.dates && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span className="truncate">{booking.dates}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Tabs for Guest Chat vs Internal Notes */}
        <Tabs defaultValue="guest" value={activeTab} onValueChange={(v) => setActiveTab(v as 'guest' | 'internal')} className="flex-1 flex flex-col min-h-0">
          <div className="px-4 pt-2 bg-muted/10 border-b flex justify-between items-center">
            <TabsList className="h-8 text-xs">
              <TabsTrigger value="guest" className="text-xs gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Guest Messages ({messages.filter(m => !m.isInternal).length})
              </TabsTrigger>
              <TabsTrigger value="internal" className="text-xs gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Internal Notes ({messages.filter(m => m.isInternal).length})
              </TabsTrigger>
            </TabsList>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-500" /> Mobile App Live Sync
            </div>
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[250px] max-h-[380px] bg-background">
            {/* Active Exception / Price Adjustment Banner for Mobile App View */}
            {activeException && (
              <div className="border-2 border-amber-300 bg-amber-50/90 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-amber-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs text-amber-900">Vendor Exception & Price Revision Request</h4>
                      <p className="text-[11px] text-amber-700">Raised on {activeException.createdAt}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-[10px]">
                    {activeException.status}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-amber-950">
                  <p className="font-semibold text-amber-900">Reason: <span className="font-medium text-amber-950">{activeException.reason}</span></p>
                  <p className="text-amber-800 leading-relaxed bg-amber-100/50 p-2 rounded border border-amber-200/60">
                    "{activeException.details}"
                  </p>
                </div>

                {/* Price Breakdown Pill */}
                <div className="flex items-center justify-between bg-white/80 p-3 rounded-lg border border-amber-200">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Original Price</span>
                    <p className="text-xs line-through text-muted-foreground font-semibold">AED {activeException.originalCost.toFixed(2)}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-600" />
                  <div className="text-right">
                    <span className="text-[10px] text-amber-700 uppercase font-bold tracking-wider">New Proposed Price</span>
                    <p className="text-sm font-bold text-emerald-600">AED {activeException.proposedCost.toFixed(2)}</p>
                  </div>
                </div>

                {/* Interactive Action Buttons for Mobile Guest Frontend */}
                {activeException.status === 'Pending Guest Approval' ? (
                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9"
                      onClick={handleGuestApproveException}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve AED {activeException.proposedCost.toFixed(2)}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 gap-1.5 text-rose-700 border-rose-200 hover:bg-rose-50 text-xs h-9"
                      onClick={handleGuestDeclineException}
                    >
                      <XCircle className="w-4 h-4" />
                      Decline Request
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-1 text-xs font-semibold text-amber-900 border-t border-amber-200 pt-2 flex items-center justify-center gap-1.5">
                    {activeException.status === 'Approved' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Price Update Approved. Vendor notified in system.</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Price Update Declined by Guest.</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {visibleMessages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs">
                No messages yet in this thread.
              </div>
            ) : (
              visibleMessages.map((msg) => {
                const isGuest = msg.sender === 'Guest';
                const isSystem = msg.sender === 'System';
                const isInternal = msg.isInternal;

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="bg-muted/60 text-muted-foreground text-[11px] px-3 py-1 rounded-full border flex items-center gap-1.5 text-center max-w-[90%]">
                        <Sparkles className="w-3 h-3 text-primary shrink-0" />
                        <span>{msg.text}</span>
                        <span className="text-[9px] opacity-70 shrink-0">({msg.timestamp})</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      isGuest ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <Avatar className="w-7 h-7 border text-[11px] font-bold">
                      <AvatarFallback className={
                        isGuest ? 'bg-primary/10 text-primary' : 
                        isInternal ? 'bg-amber-100 text-amber-800' : 'bg-slate-900 text-white'
                      }>
                        {msg.senderName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className={`max-w-[78%] space-y-1 ${isGuest ? 'items-start' : 'items-end flex flex-col'}`}>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-semibold text-foreground">{msg.senderName}</span>
                        {isInternal && (
                          <Badge variant="outline" className="text-[9px] py-0 px-1 bg-amber-50 text-amber-700 border-amber-200">
                            Internal Note
                          </Badge>
                        )}
                        <span className="text-muted-foreground text-[10px]">{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          isInternal 
                            ? 'bg-amber-50/90 text-amber-950 border border-amber-200/80' 
                            : isGuest 
                              ? 'bg-muted/50 text-foreground border rounded-tl-xs' 
                              : 'bg-primary text-primary-foreground rounded-tr-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Reply Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t bg-muted/20 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Input
                placeholder={
                  activeTab === 'internal' 
                    ? "Add an internal staff note (hidden from guest)..." 
                    : `Reply to ${booking.guestName}...`
                }
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="text-xs bg-background h-9 focus-visible:ring-1"
              />
              <Button type="submit" size="sm" className="h-9 px-3 gap-1.5 flex-shrink-0">
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
            {activeTab === 'internal' && (
              <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3" /> Internal notes are visible only to internal staff and vendor admins.
              </p>
            )}
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GuestCommunicationModal;