"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Send, 
  User, 
  Building2, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Lock,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';

export interface BookingCommsData {
  id: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  propertyName?: string;
  serviceCategory?: string;
  dates?: string;
  status?: string;
}

interface Message {
  id: string;
  sender: 'Guest' | 'Host/Admin' | 'Vendor' | 'System';
  senderName: string;
  text: string;
  timestamp: string;
  isInternal?: boolean;
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
        text: `Hello ${name.split(' ')[0]}! We'll do our best to accommodate. Housekeeping is scheduled to finish by 12:30 PM. We will notify you as soon as the keycode is activated.`,
        timestamp: 'May 18, 11:05 AM'
      },
      {
        id: '4',
        sender: 'Guest',
        senderName: name,
        text: `That would be fantastic, thank you so much! Also, could we get two extra sets of towels?`,
        timestamp: 'May 18, 11:20 AM'
      },
      {
        id: '5',
        sender: 'Host/Admin',
        senderName: 'Straizen Concierge',
        text: `Noted! Additional towels have been added to the housekeeping instruction list.`,
        timestamp: 'May 18, 11:45 AM'
      }
    ],
    'Car Rentals': [
      {
        id: '1',
        sender: 'System',
        senderName: 'Straizen System',
        text: `Vehicle reservation confirmed. Delivery location: Terminal 3 Arrival Gate.`,
        timestamp: 'May 19, 08:00 AM'
      },
      {
        id: '2',
        sender: 'Guest',
        senderName: name,
        text: `Hi, will the driver meet me inside the arrival hall with a name sign?`,
        timestamp: 'May 19, 08:45 AM'
      },
      {
        id: '3',
        sender: 'Vendor',
        senderName: 'Apex Luxury Fleet Support',
        text: `Yes, Mr./Ms. ${name.split(' ')[1] || name}. Our representative will hold a sign with your name right at Exit 2. Vehicle is sanitized and ready.`,
        timestamp: 'May 19, 09:12 AM'
      },
      {
        id: '4',
        sender: 'Guest',
        senderName: name,
        text: `Great, flight Emirates EK202 just landed on time. Heading through immigration now.`,
        timestamp: 'May 19, 09:50 AM'
      }
    ],
    'In House Catering': [
      {
        id: '1',
        sender: 'Guest',
        senderName: name,
        text: `Hello! For the catering service on our stay, two guests have severe shellfish allergies. Can we ensure a completely nut and shellfish-free preparation?`,
        timestamp: 'May 17, 02:15 PM'
      },
      {
        id: '2',
        sender: 'Vendor',
        senderName: 'Feast & Fete Chef',
        text: `Absolutely. We take dietary restrictions very seriously. All appetizers and main courses for your menu will be prepped in a segregated area.`,
        timestamp: 'May 17, 03:00 PM'
      },
      {
        id: '3',
        sender: 'Host/Admin',
        senderName: 'Straizen Quality Team',
        text: `Internal Note: Verified allergy precautions with Chef Poulain. Approved.`,
        timestamp: 'May 17, 03:10 PM',
        isInternal: true
      }
    ]
  };

  return messagesByCategory[category] || [
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
      text: `Hi! Looking forward to our service booking. Please let us know if you need any additional confirmation details.`,
      timestamp: 'May 18, 09:30 AM'
    },
    {
      id: '3',
      sender: 'Host/Admin',
      senderName: 'Straizen Support',
      text: `Welcome! Everything is set up for your scheduled time. Feel free to message us here if you have any questions before arrival.`,
      timestamp: 'May 18, 10:00 AM'
    }
  ];
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

  // Reset messages when booking changes
  React.useEffect(() => {
    setMessages(getMockMessages(booking));
  }, [booking?.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newEntry: Message = {
      id: Date.now().toString(),
      sender: activeTab === 'internal' ? 'Host/Admin' : 'Host/Admin',
      senderName: activeTab === 'internal' ? 'Admin Note' : 'Straizen Support',
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInternal: activeTab === 'internal'
    };

    setMessages(prev => [...prev, newEntry]);
    setNewMessage('');
    showSuccess(activeTab === 'internal' ? 'Internal note added' : 'Message sent to guest');
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
                Thread history with guest and service provider
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
              <Clock className="w-3 h-3 text-emerald-500" /> Real-time Sync Active
            </div>
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[250px] max-h-[360px] bg-background">
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
                      <div className="bg-muted/60 text-muted-foreground text-[11px] px-3 py-1 rounded-full border flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span>{msg.text}</span>
                        <span className="text-[9px] opacity-70">({msg.timestamp})</span>
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
                            Internal
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