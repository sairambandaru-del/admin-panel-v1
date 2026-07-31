"use client";

import React, { useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { 
  Inbox, 
  User, 
  Users, 
  Phone, 
  PhoneIncoming, 
  MessageSquare, 
  Search, 
  Sparkles, 
  Paperclip, 
  Smile, 
  Send, 
  Bot, 
  Zap, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Check, 
  CheckCheck, 
  Flame, 
  Building, 
  SlidersHorizontal, 
  Wand2, 
  X, 
  Lock, 
  PhoneCall,
  Tag
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

interface ChatConversation {
  id: string;
  guestName: string;
  avatar: string;
  avatarBg: string;
  channel: 'WhatsApp' | 'In-App' | 'SMS' | 'Email';
  lastMessage: string;
  time: string;
  unread: boolean;
  unreadCount?: number;
  direction: 'inbound' | 'outbound';
  status: 'New Lead' | 'In House Guest' | 'Hot Lead' | 'VIP Client' | 'Closed - Won';
  assignee: string;
  assigneeAvatar?: string;
  unit?: string;
  phone?: string;
  email?: string;
  messages: Array<{
    id: string;
    sender: 'guest' | 'agent' | 'system' | 'note';
    senderName?: string;
    text: string;
    time: string;
    status?: 'sent' | 'delivered' | 'read';
    channel?: string;
  }>;
}

const initialConversations: ChatConversation[] = [
  {
    id: 'conv-1',
    guestName: 'Kara Finley',
    avatar: 'KF',
    avatarBg: 'bg-pink-500',
    channel: 'WhatsApp',
    lastMessage: 'Hi Kara! 👋 How can I help you today?',
    time: 'Yesterday',
    unread: false,
    direction: 'outbound',
    status: 'New Lead',
    assignee: 'Unassigned',
    unit: 'Downtown Suite 402',
    phone: '+971 50 882 1928',
    email: 'kara.finley@techcorp.com',
    messages: [
      { id: 'm1', sender: 'system', text: 'Conversation opened by Contact via WhatsApp', time: 'Jun 18, 2025' },
      { id: 'm2', sender: 'guest', text: 'Hey there, I am interested in booking a 2BR suite for next weekend. How can I learn more?', time: '10:14 AM', channel: 'WhatsApp' },
      { id: 'm3', sender: 'agent', senderName: 'Sarah Jenkins', text: 'Hi Kara! 👋 How can I help you today? We have Downtown Suite 402 available with Burj views.', time: '10:16 AM', status: 'read', channel: 'WhatsApp' }
    ]
  },
  {
    id: 'conv-2',
    guestName: 'Alexander Wright',
    avatar: 'AW',
    avatarBg: 'bg-indigo-500',
    channel: 'In-App',
    lastMessage: 'Thank you for the confirmation. Looking forward to check-in.',
    time: '10:30 AM',
    unread: true,
    unreadCount: 2,
    direction: 'inbound',
    status: 'In House Guest',
    assignee: 'Sarah Jenkins',
    assigneeAvatar: 'SJ',
    unit: 'Marina Penthouse 12B',
    phone: '+971 52 331 9920',
    email: 'a.wright@innovate.io',
    messages: [
      { id: 'm1', sender: 'system', text: 'Booking #BK-9021 confirmed for Marina Penthouse 12B', time: 'Today' },
      { id: 'm2', sender: 'guest', text: 'Hi, can I request extra towels and early check-in at 1 PM?', time: '10:15 AM', channel: 'In-App' },
      { id: 'm3', sender: 'agent', senderName: 'Sarah Jenkins', text: 'Sure thing Alexander! I have notified housekeeping. Early check-in is approved.', time: '10:20 AM', status: 'read', channel: 'In-App' },
      { id: 'm4', sender: 'guest', text: 'Thank you for the confirmation. Looking forward to check-in.', time: '10:30 AM', channel: 'In-App' }
    ]
  },
  {
    id: 'conv-3',
    guestName: 'Shanny Lee',
    avatar: 'SL',
    avatarBg: 'bg-emerald-500',
    channel: 'WhatsApp',
    lastMessage: 'I see. I think we can accommodate the late departure.',
    time: 'Oct 6',
    unread: false,
    direction: 'outbound',
    status: 'Hot Lead',
    assignee: 'Mike Ross',
    assigneeAvatar: 'MR',
    unit: 'Palm Jumeirah Villa 05',
    phone: '+971 55 901 2211',
    email: 'shanny.l@globalfinance.com',
    messages: [
      { id: 'm1', sender: 'system', text: 'Lead scored as Hot Lead (85/100)', time: 'Oct 6' },
      { id: 'm2', sender: 'guest', text: 'We are hosting an executive retreat for 8 pax. Can we arrange private catering?', time: '2:15 PM', channel: 'WhatsApp' },
      { id: 'm3', sender: 'agent', senderName: 'Mike Ross', text: 'I see. I think we can accommodate the late departure and arrange a private chef.', time: '2:25 PM', status: 'read', channel: 'WhatsApp' }
    ]
  },
  {
    id: 'conv-4',
    guestName: 'Mohamed Al-Mansoor',
    avatar: 'MA',
    avatarBg: 'bg-amber-500',
    channel: 'SMS',
    lastMessage: 'Yes sure! Send over the quote details.',
    time: 'Sep 30',
    unread: false,
    direction: 'inbound',
    status: 'New Lead',
    assignee: 'Unassigned',
    unit: 'Executive Loft 304',
    phone: '+971 50 112 3344',
    email: 'mohamed@apex.ae',
    messages: [
      { id: 'm1', sender: 'guest', text: 'Is Executive Loft 304 open for corporate long-stay discounts?', time: 'Sep 30', channel: 'SMS' },
      { id: 'm2', sender: 'agent', senderName: 'Front Desk', text: 'Yes Mohamed! We offer 20% off stays over 14 nights. Shall I send a quote?', time: 'Sep 30', status: 'read', channel: 'SMS' },
      { id: 'm3', sender: 'guest', text: 'Yes sure! Send over the quote details.', time: 'Sep 30', channel: 'SMS' }
    ]
  },
  {
    id: 'conv-5',
    guestName: 'Lisa Thompson',
    avatar: 'LT',
    avatarBg: 'bg-purple-500',
    channel: 'Email',
    lastMessage: 'Can you arrange airport chauffeur pickup for me?',
    time: 'Sep 26',
    unread: false,
    direction: 'inbound',
    status: 'VIP Client',
    assignee: 'Concierge Team',
    unit: 'Burj View Penthouse 01',
    phone: '+44 7911 123456',
    email: 'lisa.t@luxurytravel.co.uk',
    messages: [
      { id: 'm1', sender: 'guest', text: 'Can you arrange airport chauffeur pickup for me when my flight arrives at 8 PM?', time: 'Sep 26', channel: 'Email' }
    ]
  }
];

const Communications = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations);
  const [activeConvId, setActiveConversationId] = useState<string>(initialConversations[0].id);
  
  // Left Navigation & Folders State
  const [selectedFolder, setSelectedFolder] = useState<'all' | 'mine' | 'unassigned' | 'calls' | 'new-lead' | 'hot-lead' | 'in-house' | 'vip'>('all');
  const [openSections, setCollapsibleSections] = useState({
    aiAgents: true,
    lifecycle: true,
    teamInbox: true
  });

  // Middle List State
  const [middleTab, setMiddleTab] = useState<'chats' | 'calls'>('chats');
  const [searchListQuery, setSearchListQuery] = useState('');
  const [onlyUnreplied, setOnlyUnreplied] = useState(false);

  // Active Chat State
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [messageMode, setMessageMode] = useState<'chat' | 'note'>('chat');
  const [selectedChannel, setSelectedChannel] = useState<'WhatsApp' | 'In-App' | 'SMS' | 'Email'>('WhatsApp');
  const [inputText, setInputText] = useState('');
  const [showDrawer, setShowDrawer] = useState(true);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const toggleSection = (key: keyof typeof openSections) => {
    setCollapsibleSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter Conversations based on Folder + Search + Unreplied
  const filteredConversations = conversations.filter(conv => {
    if (selectedFolder === 'mine' && conv.assignee === 'Unassigned') return false;
    if (selectedFolder === 'unassigned' && conv.assignee !== 'Unassigned') return false;
    if (selectedFolder === 'new-lead' && conv.status !== 'New Lead') return false;
    if (selectedFolder === 'hot-lead' && conv.status !== 'Hot Lead') return false;
    if (selectedFolder === 'in-house' && conv.status !== 'In House Guest') return false;
    if (selectedFolder === 'vip' && conv.status !== 'VIP Client') return false;

    if (onlyUnreplied && !conv.unread && conv.direction !== 'inbound') return false;

    if (searchListQuery) {
      const q = searchListQuery.toLowerCase();
      return (
        conv.guestName.toLowerCase().includes(q) ||
        conv.lastMessage.toLowerCase().includes(q) ||
        conv.unit?.toLowerCase().includes(q) ||
        conv.phone?.includes(q)
      );
    }

    return true;
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const isNote = messageMode === 'note';
    const newMsgId = `m-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setConversations(prev => prev.map(c => {
      if (c.id === activeConv.id) {
        return {
          ...c,
          lastMessage: isNote ? `[Internal Note] ${inputText}` : inputText,
          time: 'Just now',
          direction: isNote ? c.direction : 'outbound',
          messages: [
            ...c.messages,
            {
              id: newMsgId,
              sender: isNote ? 'note' : 'agent',
              senderName: isNote ? 'Internal Staff' : 'Sarah Jenkins',
              text: inputText,
              time: timestamp,
              status: isNote ? undefined : 'sent',
              channel: isNote ? undefined : c.channel
            }
          ]
        };
      }
      return c;
    }));

    setInputText('');
    showSuccess(isNote ? "Internal note added." : "Message sent!");

    if (!isNote) {
      setTimeout(() => {
        setConversations(prev => prev.map(c => {
          if (c.id === activeConv.id) {
            return {
              ...c,
              lastMessage: 'Got it, thank you! Speak soon.',
              time: 'Just now',
              direction: 'inbound',
              messages: [
                ...c.messages,
                {
                  id: `m-reply-${Date.now()}`,
                  sender: 'guest',
                  text: 'Got it, thank you! Speak soon.',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  channel: c.channel
                }
              ]
            };
          }
          return c;
        }));
      }, 2000);
    }
  };

  const handleAiAssist = () => {
    const aiSuggestion = `Hello ${activeConv.guestName.split(' ')[0]}! I can certainly assist you with booking details for ${activeConv.unit || 'our suites'}. Would you like me to send a quote?`;
    setInputText(aiSuggestion);
    showSuccess("AI Draft generated!");
  };

  const handleAiSummarize = () => {
    showSuccess(`AI Summary for ${activeConv.guestName}: Guest inquiring about stay dates & amenities for ${activeConv.unit || 'suite'}. Key interest in early check-in.`);
  };

  const handleAssigneeChange = (newAssignee: string) => {
    setConversations(prev => prev.map(c => 
      c.id === activeConv.id ? { ...c, assignee: newAssignee, assigneeAvatar: newAssignee.slice(0, 2).toUpperCase() } : c
    ));
    showSuccess(`Conversation reassigned to ${newAssignee}.`);
  };

  const handleCloseConversation = () => {
    setConversations(prev => prev.map(c => 
      c.id === activeConv.id ? { ...c, status: 'Closed - Won' } : c
    ));
    showSuccess(`Conversation with ${activeConv.guestName} marked as Closed.`);
  };

  const getChannelBadge = (channel: ChatConversation['channel']) => {
    switch (channel) {
      case 'WhatsApp':
        return <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">W</div>;
      case 'In-App':
        return <div className="w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[8px] font-bold">A</div>;
      case 'SMS':
        return <div className="w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px] font-bold">S</div>;
      case 'Email':
        return <div className="w-3.5 h-3.5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[8px] font-bold">E</div>;
    }
  };

  return (
    <TooltipProvider>
      <div className="h-[calc(100vh-210px)] flex border rounded-2xl bg-card overflow-hidden shadow-xs">
        
        {/* PANEL 1: LEFT INBOX & FOLDER SIDEBAR */}
        <div className="w-44 border-r bg-muted/20 flex flex-col shrink-0 select-none">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-primary" />
              <span className="font-bold text-xs text-foreground">Inbox</span>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
              {conversations.length}
            </Badge>
          </div>

          <ScrollArea className="flex-1 px-2 py-2">
            <div className="space-y-3 text-xs">
              <div className="space-y-0.5">
                <button
                  onClick={() => setSelectedFolder('all')}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors font-medium text-[11px]",
                    selectedFolder === 'all' ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted text-foreground"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <Inbox className="w-3.5 h-3.5" />
                    <span className="truncate">All Conversations</span>
                  </div>
                  <span className="font-mono text-[10px] opacity-80">{conversations.length}</span>
                </button>

                <button
                  onClick={() => setSelectedFolder('mine')}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors font-medium text-[11px]",
                    selectedFolder === 'mine' ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate">Assigned to Me</span>
                  </div>
                  <span className="font-mono text-[10px] opacity-80">3</span>
                </button>

                <button
                  onClick={() => setSelectedFolder('unassigned')}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors font-medium text-[11px]",
                    selectedFolder === 'unassigned' ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span className="truncate">Unassigned</span>
                  </div>
                  <span className="font-mono text-[10px] opacity-80">2</span>
                </button>

                <button
                  onClick={() => setSelectedFolder('calls')}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors font-medium text-[11px]",
                    selectedFolder === 'calls' ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <PhoneIncoming className="w-3.5 h-3.5" />
                    <span className="truncate">Calls</span>
                  </div>
                  <span className="font-mono text-[10px] opacity-80">0</span>
                </button>
              </div>

              {/* Collapsible: AI Agents */}
              <div className="pt-2 border-t">
                <button 
                  onClick={() => toggleSection('aiAgents')}
                  className="w-full flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 px-1 hover:text-foreground"
                >
                  <span>AI Agents</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", !openSections.aiAgents && "-rotate-90")} />
                </button>
                {openSections.aiAgents && (
                  <div className="space-y-0.5 pl-1">
                    <div className="flex items-center justify-between px-2 py-1 rounded-md text-[11px] text-muted-foreground hover:bg-muted cursor-pointer">
                      <div className="flex items-center gap-1.5 truncate">
                        <Bot className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">AI Sales Bot</span>
                      </div>
                      <span className="font-mono text-[10px]">50</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible: Lifecycle */}
              <div className="pt-2 border-t">
                <button 
                  onClick={() => toggleSection('lifecycle')}
                  className="w-full flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 px-1 hover:text-foreground"
                >
                  <span>Lifecycle</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", !openSections.lifecycle && "-rotate-90")} />
                </button>
                {openSections.lifecycle && (
                  <div className="space-y-0.5 pl-1">
                    <button
                      onClick={() => setSelectedFolder('new-lead')}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] transition-colors",
                        selectedFolder === 'new-lead' ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Badge variant="outline" className="text-[8px] px-1 py-0 bg-blue-50 text-blue-700 border-blue-200 shrink-0 whitespace-nowrap">NEW</Badge>
                        <span className="truncate">New Lead</span>
                      </div>
                      <span className="font-mono text-[10px]">2</span>
                    </button>

                    <button
                      onClick={() => setSelectedFolder('hot-lead')}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] transition-colors",
                        selectedFolder === 'hot-lead' ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">Hot Lead</span>
                      </div>
                      <span className="font-mono text-[10px]">1</span>
                    </button>

                    <button
                      onClick={() => setSelectedFolder('in-house')}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] transition-colors",
                        selectedFolder === 'in-house' ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Building className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">In House</span>
                      </div>
                      <span className="font-mono text-[10px]">1</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* PANEL 2: MIDDLE CONVERSATION LIST */}
        <div className="w-64 border-r flex flex-col shrink-0 bg-background select-none">
          <div className="p-3 border-b space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button 
                  onClick={() => setMiddleTab('chats')} 
                  className={cn("text-xs font-bold pb-0.5 border-b-2 transition-colors", middleTab === 'chats' ? "border-primary text-primary" : "border-transparent text-muted-foreground")}
                >
                  Chats
                </button>
                <button 
                  onClick={() => setMiddleTab('calls')} 
                  className={cn("text-xs font-bold pb-0.5 border-b-2 transition-colors", middleTab === 'calls' ? "border-primary text-primary" : "border-transparent text-muted-foreground")}
                >
                  Calls
                </button>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 hover:text-foreground text-muted-foreground rounded" onClick={() => showSuccess("Sorting menu opened")}>
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Sort & Filter</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground font-medium">All, Newest</span>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-[10px]">Unreplied</span>
                <Switch 
                  checked={onlyUnreplied} 
                  onCheckedChange={setOnlyUnreplied} 
                  className="scale-75"
                />
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchListQuery}
                onChange={e => setSearchListQuery(e.target.value)}
                className="pl-8 h-7 text-xs bg-muted/30"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No conversations match.
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const isSelected = activeConvId === conv.id;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setActiveConversationId(conv.id);
                        setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread: false, unreadCount: 0 } : c));
                      }}
                      className={cn(
                        "w-full p-3 text-left transition-colors flex items-start gap-2.5 relative group",
                        isSelected ? "bg-accent/80 border-l-4 border-l-primary" : "hover:bg-muted/50"
                      )}
                    >
                      <div className="relative shrink-0 mt-0.5">
                        <Avatar className="w-9 h-9 border">
                          <AvatarFallback className={cn("text-white font-bold text-xs", conv.avatarBg)}>
                            {conv.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 ring-1 ring-background rounded-full">
                          {getChannelBadge(conv.channel)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-1">
                          <p className="font-bold text-xs text-foreground truncate">{conv.guestName}</p>
                          <span className="text-[10px] text-muted-foreground shrink-0 font-mono">{conv.time}</span>
                        </div>

                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground truncate">
                          {conv.direction === 'outbound' ? (
                            <ArrowUpRight className="w-3 h-3 text-blue-500 shrink-0" />
                          ) : (
                            <ArrowDownLeft className="w-3 h-3 text-emerald-500 shrink-0" />
                          )}
                          <span className="truncate text-[11px]">{conv.lastMessage}</span>
                        </div>

                        <div className="mt-1.5 flex items-center justify-between gap-1">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[9px] px-1.5 py-0 rounded-md font-medium shrink-0 whitespace-nowrap",
                              conv.status === 'New Lead' ? "bg-blue-50 text-blue-800 border-blue-200" :
                              conv.status === 'In House Guest' ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                              conv.status === 'Hot Lead' ? "bg-amber-50 text-amber-800 border-amber-200" :
                              "bg-purple-50 text-purple-800 border-purple-200"
                            )}
                          >
                            {conv.status}
                          </Badge>

                          <div className="flex items-center gap-1">
                            {conv.unread && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                            {conv.assigneeAvatar ? (
                              <Avatar className="w-4 h-4 border shrink-0">
                                <AvatarFallback className="text-[8px] bg-muted font-bold text-foreground">
                                  {conv.assigneeAvatar}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <User className="w-3 h-3 text-muted-foreground shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* PANEL 3: MAIN CHAT CANVAS */}
        <div className="flex-1 flex flex-col bg-card min-w-0">
          {/* Header */}
          <div className="p-3 border-b flex items-center justify-end gap-1.5 shrink-0 bg-background overflow-hidden min-w-0">
            <Select value={activeConv.assignee} onValueChange={handleAssigneeChange}>
              <SelectTrigger className="h-7 text-[11px] font-semibold w-28 bg-muted/30 shrink-0">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
                <SelectItem value="Sarah Jenkins">Sarah Jenkins</SelectItem>
                <SelectItem value="Mike Ross">Mike Ross</SelectItem>
                <SelectItem value="Front Desk">Front Desk</SelectItem>
                <SelectItem value="Concierge Team">Concierge Team</SelectItem>
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                  onClick={() => setShowChatSearch(!showChatSearch)}
                >
                  <Search className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search chat</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-muted-foreground hover:text-primary shrink-0"
                  onClick={() => showSuccess(`Initiating call to ${activeConv.phone}...`)}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Call Guest</TooltipContent>
            </Tooltip>

            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs gap-1 border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-bold px-2 shrink-0 whitespace-nowrap"
              onClick={handleCloseConversation}
            >
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Close
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-7 w-7 shrink-0", showDrawer ? "text-primary" : "text-muted-foreground")}
              onClick={() => setShowDrawer(!showDrawer)}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </Button>
          </div>

          {showChatSearch && (
            <div className="p-2 border-b bg-muted/20 flex items-center gap-2 shrink-0">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <Input 
                placeholder="Search messages..."
                value={chatSearchQuery}
                onChange={e => setChatSearchQuery(e.target.value)}
                className="h-7 text-xs bg-background"
              />
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setShowChatSearch(false)}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {/* Messages Stream */}
          <ScrollArea className="flex-1 p-3 bg-muted/10">
            <div className="space-y-3 max-w-2xl mx-auto">
              {activeConv.messages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="px-3 py-0.5 bg-muted/80 rounded-full text-[10px] font-medium text-muted-foreground shadow-2xs border">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                if (msg.sender === 'note') {
                  return (
                    <div key={msg.id} className="p-2.5 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-1 text-xs text-amber-900 shadow-2xs">
                      <div className="flex items-center justify-between font-bold text-[10px] text-amber-800 border-b border-amber-200 pb-0.5">
                        <span>🔒 Internal Comment by {msg.senderName}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  );
                }

                const isAgent = msg.sender === 'agent';

                return (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex flex-col max-w-[80%]",
                      isAgent ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-1 mb-0.5">
                      <span className="font-bold text-foreground">{isAgent ? (msg.senderName || 'Staff Agent') : activeConv.guestName}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>

                    <div className={cn(
                      "p-2.5 rounded-2xl text-xs space-y-1 shadow-2xs relative",
                      isAgent 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-background border text-foreground rounded-tl-none"
                    )}>
                      <p className="leading-relaxed">{msg.text}</p>
                      
                      {isAgent && (
                        <div className="flex justify-end items-center gap-1 pt-0.5 text-[9px] text-primary-foreground/80">
                          <CheckCheck className="w-3 h-3 text-emerald-300" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* RESPOND.IO COMPOSER */}
          <div className="border-t p-2.5 bg-background space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-2 border-b pb-1.5">
              <div className="flex items-center gap-2">
                <div className="flex bg-muted p-0.5 rounded-lg border">
                  <button 
                    onClick={() => setMessageMode('chat')}
                    className={cn(
                      "px-2 py-0.5 text-xs font-semibold rounded-md transition-all",
                      messageMode === 'chat' ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Message
                  </button>
                  <button 
                    onClick={() => setMessageMode('note')}
                    className={cn(
                      "px-2 py-0.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1",
                      messageMode === 'note' ? "bg-amber-100 text-amber-900 shadow-2xs font-bold" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Lock className="w-3 h-3 text-amber-600" />
                    Internal Comment
                  </button>
                </div>

                {messageMode === 'chat' && (
                  <Select value={selectedChannel} onValueChange={(v: any) => setSelectedChannel(v)}>
                    <SelectTrigger className="h-6 text-[11px] font-bold w-26 bg-muted/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="In-App">In-App Chat</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 text-[10px] gap-1 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 font-bold px-2 shrink-0 whitespace-nowrap"
                  onClick={handleAiAssist}
                >
                  <Wand2 className="w-3 h-3 shrink-0" />
                  AI Assist
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-[10px] gap-1 text-muted-foreground hover:text-foreground px-1.5 shrink-0 whitespace-nowrap"
                  onClick={handleAiSummarize}
                >
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  Summarize
                </Button>
              </div>
            </div>

            <div className="relative">
              <Textarea
                placeholder={
                  messageMode === 'note' 
                    ? "Add internal note for staff members (invisible to guest)..." 
                    : "Use '/' for snippets, '$' for variables..."
                }
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className={cn(
                  "min-h-[50px] text-xs resize-none p-2 border-none focus-visible:ring-0",
                  messageMode === 'note' ? "bg-amber-50/50 text-amber-900 placeholder:text-amber-700/50" : "bg-transparent"
                )}
              />

              <div className="flex justify-between items-center pt-1.5 border-t mt-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <button className="p-1 hover:text-foreground rounded" onClick={() => showSuccess("Attachment dialog opened")}>
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:text-foreground rounded" onClick={() => setInputText(prev => prev + " 😊")}>
                    <Smile className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:text-foreground rounded" onClick={() => setInputText(prev => prev + " /welcome_greeting")}>
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                </div>

                <Button 
                  size="sm" 
                  className={cn(
                    "h-7 px-3 gap-1.5 font-bold text-xs shrink-0 whitespace-nowrap",
                    messageMode === 'note' ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleSendMessage()}
                >
                  <span>{messageMode === 'note' ? 'Save Note' : 'Send'}</span>
                  <Send className="w-3 h-3 shrink-0" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 4: FAR-RIGHT DRAWER */}
        {showDrawer && (
          <div className="w-56 border-l bg-muted/10 p-3.5 space-y-5 flex flex-col shrink-0 overflow-y-auto select-none">
            <div className="text-center space-y-1.5 border-b pb-3">
              <Avatar className="w-14 h-14 mx-auto border-2 border-primary/20 shadow-xs">
                <AvatarFallback className={cn("text-white font-bold text-base", activeConv.avatarBg)}>
                  {activeConv.avatar}
                </AvatarFallback>
              </Avatar>

              <div>
                <h4 className="font-bold text-xs text-foreground truncate">{activeConv.guestName}</h4>
                <Badge variant="outline" className="mt-0.5 text-[9px] bg-primary/5 text-primary border-primary/20 shrink-0 whitespace-nowrap">
                  {activeConv.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Quick Actions</span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => showSuccess(`Calling ${activeConv.phone}...`)}>
                  <Phone className="w-3 h-3 text-primary shrink-0" /> Call
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => showSuccess(`Creating support ticket for ${activeConv.guestName}...`)}>
                  <Tag className="w-3 h-3 text-primary shrink-0" /> Ticket
                </Button>
              </div>
            </div>

            <div className="space-y-2 border-t pt-3 text-xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Reservation & Unit</span>
              <div className="space-y-2 border rounded-xl p-2.5 bg-card text-[11px]">
                <div>
                  <span className="text-[9px] text-muted-foreground block font-bold">Assigned Unit</span>
                  <span className="font-bold text-foreground text-xs">{activeConv.unit || 'Pending Unit Assignment'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block font-bold">Phone Number</span>
                  <span className="font-mono text-[10px] text-foreground">{activeConv.phone}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block font-bold">Email Address</span>
                  <span className="font-mono text-[10px] text-foreground truncate block">{activeConv.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 border-t pt-3 text-xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">CRM Attributes</span>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Source:</span>
                  <span className="font-medium text-foreground">Inbound Chat</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Lead Score:</span>
                  <span className="font-bold text-emerald-600">88/100</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </TooltipProvider>
  );
};

export default Communications;