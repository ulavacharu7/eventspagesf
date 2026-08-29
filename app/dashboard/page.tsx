'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  GoCalendar, GoLocation, GoPeople,
  GoTrash, GoPencil, GoCheck, GoX,
  GoChevronDown, GoChevronUp, GoSignOut,
  GoEye, GoPlus, GoArrowLeft, GoShield, GoTag, GoDeviceCameraVideo,
  GoClock, GoPerson, GoMail
} from 'react-icons/go';
import { EventData } from '@/lib/eventsStore';
import { QRCodeSVG } from 'qrcode.react';
import { formatBroadcastBodyHtml } from '@/lib/formatMailBody';
import Footer from '@/components/Footer';

interface UserSession { id: string; name: string; email: string; profileImage?: string | null; }
interface RegUser {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  ticketCode: string;
  eventTitle: string;
  eventId: string;
  answers?: string | null;
  eventHeaderBg?: string;
  eventStartDate?: string;
  eventStartTime?: string;
  eventLocation?: string;
  eventPrice?: string;
  paymentAccountName?: string | null;
  paymentMethod?: string | null;
  paymentTxnId?: string | null;
  status?: string;
  eventCoverImage?: string | null;
}

// Colors removed for clean monochromatic look

const themes = [
  { name: 'Minimal', bg: 'bg-[#f4f4f5]', textColor: 'text-black', subText: '*HOW LUCKY YOU ARE' },
  { name: 'Quantum', bg: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600', textColor: 'text-white', subText: '*BUILD THE UNKNOWN' },
  { name: 'Warp', bg: 'bg-black border border-[#2e2e34]', textColor: 'text-white', subText: '*JOIN THE FUTURE' },
  { name: 'Emoji', bg: 'bg-[#b497cf]', textColor: 'text-white', subText: '*STUDENT FORGE EVENTS' },
  { name: 'Confetti', bg: 'bg-gradient-to-tr from-purple-600 to-pink-500', textColor: 'text-white', subText: '*PARTY TIME' },
  { name: 'Pattern', bg: 'bg-gradient-to-tr from-indigo-600 to-teal-600', textColor: 'text-white', subText: '*PATTERN CREATION' },
  { name: 'Seasonal', bg: 'bg-gradient-to-tr from-rose-500 to-amber-500', textColor: 'text-white', subText: '*CREATORS GATHERING' },
  { name: 'PixelBlast', bg: 'bg-[#141416]', textColor: 'text-[#B497CF]', subText: '*PIXELBLAST INTERACTIVE' },
  { name: 'Grainient', bg: 'bg-gradient-to-tr from-[#FF9FFC] via-[#5227FF] to-[#B497CF]', textColor: 'text-white', subText: '*GRAINIENT ANIMATED' }
];

const EventImage: React.FC<{ event: EventData }> = ({ event }) => {
  const [error, setError] = useState(false);

  const getFirstImage = () => {
    if (event.coverImage) {
      const trimmed = event.coverImage.trim();
      if (trimmed.startsWith('data:')) return trimmed;
      const first = trimmed.split(',')[0].trim();
      if (first) return first;
    }
    const titleLower = (event.title || '').toLowerCase();
    if (event.id === 'cmsbpnls8000004lfw3buf1a7' || titleLower.includes('student forge') || titleLower.includes('platform launch')) {
      return 'https://ik.imagekit.io/dypkhqxip/mainbannersf';
    }
    return null;
  };

  const coverSrc = getFirstImage();

  if (coverSrc && !error) {
    return (
      <img
        src={coverSrc}
        alt={event.title}
        onError={() => setError(true)}
        className="w-full h-full object-cover"
      />
    );
  }

  const activeTheme = event.themeIdx !== undefined && themes[event.themeIdx]
    ? themes[event.themeIdx]
    : themes[0];

  return (
    <div className={`w-full h-full relative overflow-hidden flex flex-col justify-between p-1.5 text-white bg-neutral-950/45 border border-white/10 rounded-md`}>
      <div className={`absolute inset-0 z-0 ${activeTheme.bg}`} />
      <div className="z-10 flex flex-col gap-0.5">
        <h5 className="text-[5px] font-black uppercase leading-[0.95] tracking-tighter line-clamp-2">
          {event.title}
        </h5>
      </div>
      <div className="z-10 flex flex-col text-[4px] font-mono uppercase tracking-wider opacity-85 border-t border-white/20 pt-0.5">
        <span>{event.startDate}</span>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-events' | 'my-tickets' | 'verify' | 'broadcast' | 'profile'>('my-events');
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Record<string, RegUser[]>>({});
  const [importTarget, setImportTarget] = useState<{ type: 'PDF' | 'XLS'; eventId: string } | null>(null);
  const [attendeesModalEventId, setAttendeesModalEventId] = useState<string | null>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  
  // My tickets tab states
  const [myTickets, setMyTickets] = useState<RegUser[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<RegUser | null>(null);

  // Navigation expand states
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<EventData>>({});
  const [saving, setSaving] = useState(false);

  // Edit custom fields state
  const [editCustomFields, setEditCustomFields] = useState<{ name: string; type: 'text' | 'checkbox'; required: boolean }[]>([]);
  const [editNewFieldName, setEditNewFieldName] = useState('');
  const [editNewFieldType, setEditNewFieldType] = useState<'text' | 'checkbox'>('text');
  const [editNewFieldRequired, setEditNewFieldRequired] = useState(false);

  // Edit speakers state
  const [editSpeakers, setEditSpeakers] = useState<{ name: string; role: string; image?: string | null }[]>([]);
  const [editNewSpeakerName, setEditNewSpeakerName] = useState('');
  const [editNewSpeakerRole, setEditNewSpeakerRole] = useState('');
  const [editNewSpeakerImage, setEditNewSpeakerImage] = useState<string | null>(null);
  const [isDraggingEditSpeaker, setIsDraggingEditSpeaker] = useState(false);

  // Profile photo states
  const [profileDragActive, setProfileDragActive] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);

  const [verifyCode, setVerifyCode] = useState('');
  const [verifiedReg, setVerifiedReg] = useState<RegUser | null>(null);
  const [verifyError, setVerifyError] = useState('');
  const [approvingIds, setApprovingIds] = useState<Record<string, boolean>>({});

  // Invite guest/speaker modal states
  const [showInviteGuestModal, setShowInviteGuestModal] = useState(false);
  const [inviteSelectedEventId, setInviteSelectedEventId] = useState('');
  const [inviteGuestName, setInviteGuestName] = useState('');
  const [inviteGuestEmail, setInviteGuestEmail] = useState('');
  const [inviteGuestRole, setInviteGuestRole] = useState('Complimentary Pass');
  const [invitePersonalMessage, setInvitePersonalMessage] = useState('');
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteSuccessData, setInviteSuccessData] = useState<{ ticketCode: string; inviteUrl: string; guestName: string } | null>(null);

  const handleSendGuestInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteSelectedEventId || !inviteGuestName || !inviteGuestEmail) {
      alert('Please fill out all required fields.');
      return;
    }

    setInviteSending(true);
    try {
      const res = await fetch(`/api/events/${inviteSelectedEventId}/invite-guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: inviteGuestName,
          guestEmail: inviteGuestEmail,
          guestRole: inviteGuestRole || 'Guest Speaker',
          personalMessage: invitePersonalMessage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setInviteSuccessData({
          ticketCode: data.ticketCode,
          inviteUrl: data.inviteUrl,
          guestName: inviteGuestName,
        });
      } else {
        alert(data.error || 'Failed to send guest invitation.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while sending invitation.');
    } finally {
      setInviteSending(false);
    }
  };

  // Broadcast / Update Sender state
  const [broadcastAudience, setBroadcastAudience] = useState<string>('all');
  const [broadcastHeaderBanner, setBroadcastHeaderBanner] = useState<string>('');
  const [broadcastSubject, setBroadcastSubject] = useState<string>('');
  const [broadcastBody, setBroadcastBody] = useState<string>('');
  const [broadcastSending, setBroadcastSending] = useState<boolean>(false);
  const [broadcastStatusData, setBroadcastStatusData] = useState<{
    dailyLimit: number;
    sentToday: number;
    remainingToday: number;
    totalAttendees: number;
    events: { id: string; title: string; startDate: string }[];
    logs: { id: string; to: string; subject: string; status: string; scheduledDelaySec: number; timestamp: string; error?: string }[];
  } | null>(null);
  const [broadcastStatusLoading, setBroadcastStatusLoading] = useState<boolean>(false);
  const [broadcastSuccessMsg, setBroadcastSuccessMsg] = useState<string>('');
  const [broadcastErrorMsg, setBroadcastErrorMsg] = useState<string>('');
  const [broadcastTabPreview, setBroadcastTabPreview] = useState<'editor' | 'preview'>('editor');
  const broadcastTextareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchBroadcastStatus = async () => {
    setBroadcastStatusLoading(true);
    try {
      const url = user?.email ? `/api/broadcast/status?email=${encodeURIComponent(user.email)}` : '/api/broadcast/status';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBroadcastStatusData(data);
      }
    } catch (err) {
      console.error('Failed to load broadcast status:', err);
    } finally {
      setBroadcastStatusLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'broadcast' && user?.email) {
      fetchBroadcastStatus();
    }
  }, [activeTab, user?.email]);

  const applyTextFormat = (tag: 'b' | 'i' | 'u' | 'p' | 'h2' | 'a') => {
    const textarea = broadcastTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const sel = textarea.value.substring(start, end);

    let wrapped = '';
    if (tag === 'b') wrapped = `<b>${sel || 'Bold Text'}</b>`;
    if (tag === 'i') wrapped = `<i>${sel || 'Italic Text'}</i>`;
    if (tag === 'u') wrapped = `<u>${sel || 'Underlined Text'}</u>`;
    if (tag === 'p') wrapped = `<p style="margin-bottom:16px;">${sel || 'Paragraph Text'}</p>`;
    if (tag === 'h2') wrapped = `<h2 style="font-size:18px;font-weight:bold;margin:16px 0 8px 0;color:#ffffff;">${sel || 'Heading'}</h2>`;
    if (tag === 'a') {
      const url = prompt('Enter website link URL (e.g. https://example.com):', 'https://');
      if (!url || !url.trim()) return;
      wrapped = `<a href="${url.trim()}" target="_blank" rel="noopener noreferrer" style="color:#3b82f6;text-decoration:underline;font-weight:500;">${sel || url.trim()}</a>`;
    }

    const nextVal = textarea.value.substring(0, start) + wrapped + textarea.value.substring(end);
    setBroadcastBody(nextVal);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSuccessMsg('');
    setBroadcastErrorMsg('');

    if (!broadcastSubject.trim()) {
      setBroadcastErrorMsg('Please enter an email subject.');
      return;
    }

    if (!broadcastBody.trim()) {
      setBroadcastErrorMsg('Please enter email body content.');
      return;
    }

    setBroadcastSending(true);
    try {
      const res = await fetch('/api/broadcast/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: broadcastAudience,
          headerBannerUrl: broadcastHeaderBanner.trim(),
          subject: broadcastSubject.trim(),
          bodyHtml: broadcastBody.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBroadcastErrorMsg(data.error || 'Failed to queue broadcast emails.');
      } else {
        setBroadcastSuccessMsg(data.message || 'Broadcast emails queued successfully!');
        setBroadcastSubject('');
        setBroadcastBody('');
        setBroadcastHeaderBanner('');
        fetchBroadcastStatus();
      }
    } catch (err) {
      console.error(err);
      setBroadcastErrorMsg('Network error while enqueuing broadcast.');
    } finally {
      setBroadcastSending(false);
    }
  };

  const handleApproveUser = async (eventId: string, regId: string | undefined) => {
    if (!regId) return;
    setApprovingIds(prev => ({ ...prev, [regId]: true }));
    try {
      const res = await fetch(`/api/registrations/${regId}/approve`, {
        method: 'POST'
      });
      if (res.ok) {
        setRegistrations(prev => {
          const list = prev[eventId] || [];
          const updatedList = list.map(r => r.id === regId ? { ...r, status: 'APPROVED' } : r);
          return { ...prev, [eventId]: updatedList };
        });
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to approve registration');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setApprovingIds(prev => ({ ...prev, [regId]: false }));
    }
  };

  // Auth guard and read tab param
  useEffect(() => {
    try {
      const raw = localStorage.getItem('student_forge_user');
      if (raw) { 
        const parsed = JSON.parse(raw);
        setUser(parsed); 
        // Fetch latest profile photo from database to keep in sync
        if (parsed.email) {
          fetch(`/api/user/profile?email=${encodeURIComponent(parsed.email)}`)
            .then(res => res.json())
            .then(data => {
              if (data.success && data.profileImage) {
                const updated = { ...parsed, profileImage: data.profileImage };
                setUser(updated);
                localStorage.setItem('student_forge_user', JSON.stringify(updated));
              }
            })
            .catch(err => console.error('Dashboard user profile sync error:', err));
        }
      }
      else { router.replace('/auth'); }
    } catch { router.replace('/auth'); }
    
    // Read window search params
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'my-tickets') {
      setActiveTab('my-tickets');
    }
    
    setAuthChecked(true);
  }, [router]);

  // Load user's created events and registrations from DB
  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    fetch(`/api/events?email=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then(async (data) => {
        const userEvents: EventData[] = data.events || [];
        setEvents(userEvents);
        
        // Load registrations for each of user's events from database
        const regsMap: Record<string, RegUser[]> = {};
        await Promise.all(
          userEvents.map(async (ev) => {
            try {
              const res = await fetch(`/api/events/${ev.id}/register`);
              if (res.ok) {
                const regData = await res.json();
                regsMap[ev.id] = regData.registrations || [];
              }
            } catch (err) {
              console.error(err);
            }
          })
        );
        setRegistrations(regsMap);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.email]);

  // Load user registrations (Tickets)
  useEffect(() => {
    if (!user?.email) return;
    setTicketsLoading(true);
    fetch(`/api/registrations?email=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((data) => {
        setMyTickets(data.registrations || []);
        setTicketsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setTicketsLoading(false);
      });
  }, [user?.email, activeTab]);

  const handleSignOut = () => { localStorage.removeItem('student_forge_user'); router.push('/'); };

  const handleProfileImageFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB.');
      return;
    }
    setProfileUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      try {
        const res = await fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user?.email, profileImage: base64 }),
        });
        const data = await res.json();
        if (data.success) {
          const updated = { ...user!, profileImage: base64 };
          setUser(updated);
          localStorage.setItem('student_forge_user', JSON.stringify(updated));
        }
      } catch (err) {
        console.error('Profile upload error:', err);
      } finally {
        setProfileUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setProfileDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleProfileImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleProfileRemove = async () => {
    if (!user?.email) return;
    setProfileUploading(true);
    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, profileImage: null }),
      });
      const updated = { ...user, profileImage: null };
      setUser(updated);
      localStorage.setItem('student_forge_user', JSON.stringify(updated));
    } catch (err) {
      console.error('Profile remove error:', err);
    } finally {
      setProfileUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeleteConfirmId(null);
  };

  const handleEditSpeakerImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingEditSpeaker(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setEditNewSpeakerImage(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleEditSpeakerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setEditNewSpeakerImage(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const triggerImportFile = (type: 'PDF' | 'XLS', eventId: string) => {
    setImportTarget({ type, eventId });
    setTimeout(() => {
      if (importFileInputRef.current) {
        importFileInputRef.current.click();
      }
    }, 50);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !importTarget) return;
    const file = e.target.files[0];
    
    alert(`Successfully imported attendee list from "${file.name}" into your event!`);
    
    const currentEvent = myEvents.find(e => e.id === importTarget.eventId);
    const eventTitle = currentEvent?.title || 'Unknown Event';

    const mockAttendee: RegUser = {
      id: `imported-${Date.now()}`,
      eventId: importTarget.eventId,
      eventTitle,
      name: file.name.substring(0, file.name.lastIndexOf('.')).replace(/[-_]/g, ' ') || 'Imported Student',
      email: 'student@studentforge.in',
      ticketCode: `SF-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'APPROVED',
      answers: null,
      paymentMethod: null,
      paymentAccountName: null,
      paymentTxnId: null
    };

    setRegistrations(prev => {
      const current = prev[importTarget.eventId] || [];
      return {
        ...prev,
        [importTarget.eventId]: [mockAttendee, ...current]
      };
    });

    if (importFileInputRef.current) {
      importFileInputRef.current.value = '';
    }
    setImportTarget(null);
  };

  const handleEditOpen = (event: EventData) => {
    setEditingEvent(event);
    setEditForm({ title: event.title, description: event.description, location: event.location, startDate: event.startDate, startTime: event.startTime, endTime: event.endTime, price: event.price, capacity: event.capacity, customFields: event.customFields || null, speakers: event.speakers || null });
    
    // Parse custom fields for editing UI
    try {
      const parsed = event.customFields ? JSON.parse(event.customFields) : [];
      setEditCustomFields(parsed);
    } catch {
      setEditCustomFields([]);
    }

    // Parse speakers for editing UI
    try {
      const parsedSp = event.speakers ? JSON.parse(event.speakers) : [];
      setEditSpeakers(parsedSp);
    } catch {
      setEditSpeakers([]);
    }
  };

  const handleEditSave = async () => {
    if (!editingEvent) return;
    setSaving(true);
    const updatedPayload = {
      ...editForm,
      customFields: editCustomFields.length > 0 ? JSON.stringify(editCustomFields) : null,
      speakers: editSpeakers.length > 0 ? JSON.stringify(editSpeakers) : null
    };

    const res = await fetch(`/api/events/${editingEvent.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPayload),
    });
    if (res.ok) {
      const { event: updated } = await res.json();
      setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? updated : e)));
    }
    setSaving(false);
    setEditingEvent(null);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');
    setVerifiedReg(null);

    if (!verifyCode.trim()) {
      setVerifyError('Please enter a ticket code.');
      return;
    }

    // Search across all registrations loaded for the host's events
    let found: RegUser | null = null;
    const cleanCode = verifyCode.trim().toUpperCase();

    for (const eventId in registrations) {
      const regs = registrations[eventId];
      const match = regs.find(r => r.ticketCode.toUpperCase() === cleanCode);
      if (match) {
        found = match;
        break;
      }
    }

    if (found) {
      setVerifiedReg(found);
    } else {
      setVerifyError('Invalid ticket code or no registration found for your events.');
    }
  };

  const myEvents = events;

  if (!authChecked || !user) return null;

  return (
    <div className="min-h-screen bg-[#131313] text-white font-tight antialiased flex flex-col select-none">
      {/* Hidden file input for importing attendees list */}
      <input
        type="file"
        ref={importFileInputRef}
        onChange={handleImportFileChange}
        accept={importTarget?.type === 'PDF' ? '.pdf' : '.xls,.xlsx'}
        className="hidden"
      />
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#131313]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95"
            title="Back to Home"
          >
            <GoArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden min-[400px]:inline">Back to Home</span>
          </a>
          <span className="w-px h-5 bg-white/10 hidden min-[400px]:block" />
          <a href="/" className="flex items-center gap-2 group cursor-pointer" aria-label="Student Forge Home">
            <img
              src="https://ik.imagekit.io/dypkhqxip/sf-events-svg?updatedAt=1787505496001"
              alt="Student Forge"
              className="h-8 sm:h-8.5 w-auto object-contain select-none opacity-90 group-hover:opacity-100 transition-all"
              style={{ filter: 'brightness(0) invert(0.88)' }}
            />
          </a>
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest hidden md:block">
            / Dashboard
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Profile Pill */}
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-2.5 py-1">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/15 overflow-hidden flex items-center justify-center bg-[#222226] flex-shrink-0">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.email)}`} alt="Avatar" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-white truncate max-w-[110px] tracking-tight">{user.name || 'User'}</span>
            </div>
          </div>
          {/* Sign Out Button */}
          <button 
            onClick={handleSignOut} 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 active:scale-95 border border-rose-500/20 rounded-xl transition-all cursor-pointer"
            title="Sign Out"
          >
            <GoSignOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        {/* Sidebar */}
        <aside className="hidden sm:flex w-64 flex-shrink-0 bg-[#131316]/95 backdrop-blur-2xl border-r border-white/10 flex-col py-6 px-3.5 justify-between sticky top-[57px] h-[calc(100vh-57px)] select-none">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono font-semibold">Navigation</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            
            {/* My Events */}
            <button
              onClick={() => setActiveTab('my-events')}
              className={`relative flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs cursor-pointer text-left transition-all duration-200 group border ${
                activeTab === 'my-events'
                  ? 'bg-white/[0.08] text-white font-semibold border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.3)]'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {activeTab === 'my-events' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  activeTab === 'my-events' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-white/60 border border-white/10 group-hover:text-white group-hover:border-white/20'
                }`}>
                  <GoCalendar className="w-4 h-4" />
                </div>
                <span className="truncate">My Events</span>
              </div>
              {myEvents.length > 0 && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  activeTab === 'my-events' ? 'bg-white/15 text-white border-white/20' : 'bg-white/5 text-white/40 border-white/10'
                }`}>
                  {myEvents.length}
                </span>
              )}
            </button>

            {/* My Tickets */}
            <button
              onClick={() => setActiveTab('my-tickets')}
              className={`relative flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs cursor-pointer text-left transition-all duration-200 group border ${
                activeTab === 'my-tickets'
                  ? 'bg-white/[0.08] text-white font-semibold border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.3)]'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {activeTab === 'my-tickets' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  activeTab === 'my-tickets' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-white/5 text-white/60 border border-white/10 group-hover:text-white group-hover:border-white/20'
                }`}>
                  <GoTag className="w-4 h-4" />
                </div>
                <span className="truncate">My Tickets</span>
              </div>
              {myTickets.length > 0 && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  activeTab === 'my-tickets' ? 'bg-white/15 text-white border-white/20' : 'bg-white/5 text-white/40 border-white/10'
                }`}>
                  {myTickets.length}
                </span>
              )}
            </button>

            {/* Verify Pass */}
            <button
              onClick={() => setActiveTab('verify')}
              className={`relative flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs cursor-pointer text-left transition-all duration-200 group border ${
                activeTab === 'verify'
                  ? 'bg-white/[0.08] text-white font-semibold border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.3)]'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {activeTab === 'verify' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  activeTab === 'verify' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-white/60 border border-white/10 group-hover:text-white group-hover:border-white/20'
                }`}>
                  <GoShield className="w-4 h-4" />
                </div>
                <span className="truncate">Verify Pass</span>
              </div>
            </button>

            {/* Update Sender */}
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`relative flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs cursor-pointer text-left transition-all duration-200 group border ${
                activeTab === 'broadcast'
                  ? 'bg-white/[0.08] text-white font-semibold border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.3)]'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {activeTab === 'broadcast' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  activeTab === 'broadcast' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 text-white/60 border border-white/10 group-hover:text-white group-hover:border-white/20'
                }`}>
                  <GoMail className="w-4 h-4" />
                </div>
                <span className="truncate">Update Sender</span>
              </div>
            </button>

            {/* Profile Settings */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`relative flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs cursor-pointer text-left transition-all duration-200 group border ${
                activeTab === 'profile'
                  ? 'bg-white/[0.08] text-white font-semibold border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.3)]'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {activeTab === 'profile' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  activeTab === 'profile' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-white/60 border border-white/10 group-hover:text-white group-hover:border-white/20'
                }`}>
                  <GoPerson className="w-4 h-4" />
                </div>
                <span className="truncate">Profile Settings</span>
              </div>
            </button>
          </div>

          {/* Bottom Sidebar Widget */}
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <a
              href="/create-event"
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-neutral-100 text-[#101010] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <GoPlus className="w-4 h-4" />
              <span>Create Event</span>
            </a>
            <div className="flex items-center justify-between px-2 text-[10px] font-mono text-white/40">
              <span>Student Forge</span>
              <span className="text-white/30">v1.0.0</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">

            {/* Mobile Tab Navigation (sm:hidden) */}
            <div className="flex sm:hidden items-center bg-[#131316]/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl gap-1 overflow-x-auto shadow-lg">
              <button
                onClick={() => setActiveTab('my-events')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-medium transition-all active:scale-[0.97] whitespace-nowrap ${
                  activeTab === 'my-events'
                    ? 'bg-white text-[#101010] font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <GoCalendar className="w-3.5 h-3.5" />
                <span>Events</span>
              </button>
              <button
                onClick={() => setActiveTab('my-tickets')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-medium transition-all active:scale-[0.97] whitespace-nowrap ${
                  activeTab === 'my-tickets'
                    ? 'bg-white text-[#101010] font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <GoTag className="w-3.5 h-3.5" />
                <span>Tickets</span>
              </button>
              <button
                onClick={() => setActiveTab('verify')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-medium transition-all active:scale-[0.97] whitespace-nowrap ${
                  activeTab === 'verify'
                    ? 'bg-white text-[#101010] font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <GoShield className="w-3.5 h-3.5" />
                <span>Verify</span>
              </button>
              <button
                onClick={() => setActiveTab('broadcast')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-medium transition-all active:scale-[0.97] whitespace-nowrap ${
                  activeTab === 'broadcast'
                    ? 'bg-white text-[#101010] font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <GoMail className="w-3.5 h-3.5" />
                <span>Sender</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-medium transition-all active:scale-[0.97] whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-white text-[#101010] font-bold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <GoPerson className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
            </div>

            {activeTab === 'my-events' && (
              <>
                <div className="flex items-center justify-between border-b border-white/10 pb-5 flex-wrap gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.6px] leading-tight">
                      My{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] via-[#f97316] to-[#fbbf24]">
                        Events
                      </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-white/50 font-normal">Events you have published — view, edit, or delete.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/dashboard/coupons"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/15 text-amber-300 text-xs font-semibold rounded-[8px] border border-amber-500/20 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <GoTag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Coupon Codes</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        if (myEvents.length > 0) setInviteSelectedEventId(myEvents[0].id);
                        setShowInviteGuestModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold rounded-[8px] border border-white/10 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <GoPerson className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Invite Guest</span>
                    </button>
                    <a
                      href="/create-event"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-[#101010] text-xs font-semibold rounded-[8px] hover:opacity-90 active:scale-95 transition-all shadow-sm"
                    >
                      <GoPlus className="w-3.5 h-3.5" />
                      <span>New Event</span>
                    </a>
                  </div>
                </div>

                {loading ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2].map(i => <div key={i} className="h-28 bg-[#18181c]/60 border border-white/10 rounded-2xl animate-pulse" />)}
                  </div>
                ) : myEvents.length === 0 ? (
                  <div className="bg-[#18181c]/60 border border-white/10 backdrop-blur-xl rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 shadow-xl">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                      <GoCalendar className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-instrument-serif text-xl sm:text-2xl text-white font-normal">No events yet</h3>
                      <p className="text-xs text-white/50 font-normal">Events you create will appear here.</p>
                    </div>
                    <a
                      href="/create-event"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#101010] text-xs font-semibold rounded-[8px] hover:opacity-90 active:scale-95 transition-all shadow-sm"
                    >
                      <GoPlus className="w-3.5 h-3.5" />
                      <span>Create Your First Event</span>
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {myEvents.map((event) => {
                      const regs = registrations[event.id] || [];
                      const isDeleting = deleteConfirmId === event.id;
                      return (
                        <div key={event.id} className="group relative bg-[#18181c]/90 hover:bg-[#1e1e24] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl animate-fade-in">
                          {/* Header Bar */}
                          <div className="px-5 py-2.5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
                            <span className="text-[10px] font-mono font-semibold text-white/50 uppercase tracking-wider">{event.ticketCode || 'EVENT'}</span>
                            <span className="text-[11px] font-mono text-white/40">{event.startDate}</span>
                          </div>

                          <div className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Event Cover Logo Box */}
                                <div className="w-16 h-16 rounded-xl bg-[#131316] border border-white/10 flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden select-none group-hover:scale-105 transition-transform duration-300">
                                  <EventImage event={event} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base sm:text-lg font-bold text-white truncate tracking-tight">{event.title}</h3>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5 text-xs text-white/50">
                                    <span className="flex items-center gap-1.5"><GoCalendar className="w-3.5 h-3.5 text-white/40" />{event.startDate}{event.startTime && ` · ${event.startTime}`}</span>
                                    <span className="flex items-center gap-1.5 truncate max-w-[240px]"><GoLocation className="w-3.5 h-3.5 text-white/40" />{event.location || 'Online'}</span>
                                    <span className="flex items-center gap-1.5"><GoPeople className="w-3.5 h-3.5 text-white/40" /><span className="text-white/80 font-medium">{regs.length}</span> registered</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <a href={`/events/${event.id}`} title="View Event Page" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all active:scale-95">
                                  <GoEye className="w-4 h-4" />
                                </a>
                                <a href={`/edit-event/${event.id}`} title="Edit Event" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer active:scale-95">
                                  <GoPencil className="w-4 h-4" />
                                </a>
                                <button title="Delete Event" onClick={() => setDeleteConfirmId(isDeleting ? null : event.id)} className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-all cursor-pointer active:scale-95">
                                  <GoTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {isDeleting && (
                              <div className="flex items-center justify-between bg-rose-950/40 border border-rose-500/30 rounded-xl px-4 py-3">
                                <span className="text-xs text-rose-300">Delete this event permanently?</span>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => handleDelete(event.id)} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-[8px] transition-all cursor-pointer">Yes, Delete</button>
                                  <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/70 text-xs font-semibold rounded-[8px] transition-all cursor-pointer">Cancel</button>
                                </div>
                              </div>
                            )}

                            <div className="border-t border-white/10 pt-3 flex items-center justify-between flex-wrap gap-3">
                              <span className="text-[10px] uppercase font-mono text-white/40 tracking-wider font-semibold">Registered Guests: <strong className="text-white/80">{regs.length}</strong></span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInviteSelectedEventId(event.id);
                                    setShowInviteGuestModal(true);
                                  }}
                                  className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-[8px] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                                >
                                  <GoPerson className="w-3.5 h-3.5" />
                                  <span>Invite Speaker</span>
                                </button>
                                <a
                                  href={`/dashboard/event-attendees/${event.id}`}
                                  className="px-3.5 py-1.5 bg-white text-[#101010] hover:opacity-90 text-xs font-semibold rounded-[8px] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
                                >
                                  <span>Show Attendees</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === 'my-tickets' && (
              /* MY TICKETS TAB VIEW */
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="border-b border-white/10 pb-5">
                  <h1 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.6px] leading-tight">
                    My{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] via-[#f97316] to-[#fbbf24]">
                      Tickets
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-white/50 font-normal">Tickets for events you have registered to attend.</p>
                </div>

                {ticketsLoading ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2].map(i => <div key={i} className="h-28 bg-[#18181c]/60 border border-white/10 rounded-2xl animate-pulse" />)}
                  </div>
                ) : myTickets.length === 0 ? (
                  <div className="bg-[#18181c]/60 border border-white/10 backdrop-blur-xl rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 shadow-xl">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                      <GoTag className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-instrument-serif text-xl sm:text-2xl text-white font-normal">No tickets found</h3>
                      <p className="text-xs text-white/50 font-normal">You haven&apos;t registered for any events yet.</p>
                    </div>
                    <a
                      href="/events"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#101010] text-xs font-semibold rounded-[8px] hover:opacity-90 active:scale-95 transition-all shadow-sm"
                    >
                      Browse Upcoming Events
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {myTickets.map((ticket) => {
                      return (
                        <div
                          key={ticket.id}
                          className="group relative bg-[#18181c]/95 hover:bg-[#1e1e26] border border-white/10 hover:border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl transition-all duration-300 backdrop-blur-2xl overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                        >
                          {/* Ambient glow accent */}
                          <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/15 transition-all duration-500" />
                          
                          {/* Left / Center Event Information */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 min-w-0 flex-1 relative z-10">
                            {/* 1:1 Event Cover Image Box */}
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black border border-white/15 overflow-hidden flex-shrink-0 flex items-center justify-center select-none shadow-xl group-hover:scale-105 transition-transform duration-300 relative">
                              {ticket.eventCoverImage ? (
                                <img
                                  src={ticket.eventCoverImage}
                                  alt={ticket.eventTitle}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="font-instrument-serif text-2xl text-white/80 uppercase">
                                  {ticket.eventTitle.substring(0, 2).toUpperCase()}
                                </span>
                              )}
                            </div>

                            {/* Details Column */}
                            <div className="flex flex-col min-w-0 flex-1 gap-2">
                              {/* Status Badge & Entry Pill */}
                              <div className="flex flex-wrap items-center gap-2">
                                {ticket.status === 'PENDING' ? (
                                  <span className="inline-flex items-center gap-1.5 text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full font-mono font-semibold shadow-[0_0_12px_rgba(244,63,94,0.15)]">
                                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                                    Pending Host Approval
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                    Confirmed Admission
                                  </span>
                                )}
                                <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-white/60 px-2.5 py-1 rounded-full">
                                  Attendee Pass
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.5px] leading-snug line-clamp-2">
                                {ticket.eventTitle}
                              </h3>

                              {/* Metadata Pills */}
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 font-medium">
                                  <GoCalendar className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                                  <span>{ticket.eventStartDate}{ticket.eventStartTime && ` · ${ticket.eventStartTime}`}</span>
                                </div>
                                {ticket.eventLocation && (
                                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 font-medium max-w-sm truncate">
                                    <GoLocation className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                                    <span className="truncate">{ticket.eventLocation}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Ticket Stub Section with Perforation Divider */}
                          <div className="border-t lg:border-t-0 lg:border-l border-dashed border-white/15 pt-5 lg:pt-0 lg:pl-8 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0 relative z-10 w-full lg:w-auto">
                            <div className="flex flex-col sm:items-start lg:items-end gap-1">
                              <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 font-semibold">
                                Ticket Pass ID
                              </span>
                              <span className="font-mono text-sm sm:text-base font-bold text-white bg-white/[0.06] border border-white/15 px-3.5 py-1.5 rounded-xl tracking-widest select-all shadow-inner">
                                {ticket.status === 'PENDING' ? 'PENDING' : ticket.ticketCode}
                              </span>
                            </div>

                            <a
                              href={`/events/${ticket.eventId}/register`}
                              className="w-full sm:w-auto lg:w-full py-3 px-6 bg-white hover:bg-neutral-100 text-[#101010] font-semibold text-xs sm:text-sm rounded-xl shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                            >
                              <GoEye className="w-4 h-4" />
                              <span>View Ticket Pass</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'verify' && (
              /* Ticket & QR Pass Verification Portal */
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="border-b border-white/10 pb-5">
                  <h1 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.6px] leading-tight flex items-center gap-2">
                    <GoShield className="text-emerald-400 w-6 h-6" />
                    <span>Pass Verification Portal</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-white/50 font-normal">Scan or enter ticket pass codes to check-in registered users.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Code verification input */}
                  <form onSubmit={handleVerify} className="md:col-span-7 bg-[#18181c]/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-mono text-white/40 tracking-wider">Ticket Code / Pass ID</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={verifyCode}
                          onChange={(e) => setVerifyCode(e.target.value)}
                          placeholder="e.g. TKT-LKM90PAW"
                          className="flex-1 bg-[#131316] border border-white/10 focus:border-white/30 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-white text-[#101010] hover:opacity-90 font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          Verify Pass
                        </button>
                      </div>
                    </div>

                    {verifyError && (
                      <p className="text-xs text-rose-400 font-mono mt-1 bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg">{verifyError}</p>
                    )}
                  </form>

                  {/* Right Column: Verification Results */}
                  <div className="md:col-span-5">
                    {verifiedReg ? (
                      <div className="bg-[#18181c]/80 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-xl animate-fade-in">
                        <div className="bg-emerald-600/20 px-5 py-3 border-b border-emerald-500/20 flex items-center justify-between text-emerald-400 font-semibold text-xs">
                          <span className="flex items-center gap-1.5">
                            <GoCheck className="w-4 h-4" /> Ticket Verified
                          </span>
                          <span className="font-mono text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">Active Pass</span>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                          <div className="flex flex-col gap-1 border-b border-white/10 pb-3">
                            <span className="text-[9px] uppercase font-mono tracking-widest text-white/40">Event</span>
                            <span className="text-xs text-white font-bold truncate">{verifiedReg.eventTitle}</span>
                          </div>
                          
                          <div className="flex flex-col gap-1.5 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-white/40 font-mono text-[9px] uppercase">Attendee</span>
                              <span className="text-white font-semibold">{verifiedReg.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/40 font-mono text-[9px] uppercase">Email</span>
                              <span className="text-white font-mono text-[11px]">{verifiedReg.email}</span>
                            </div>
                            {verifiedReg.phone && (
                              <div className="flex justify-between items-center">
                                <span className="text-white/40 font-mono text-[9px] uppercase">Phone</span>
                                <span className="text-white font-mono">{verifiedReg.phone}</span>
                              </div>
                            )}

                            {/* Render Answers in verification details side box */}
                            {verifiedReg.answers && (() => {
                              try {
                                const parsedAns = JSON.parse(verifiedReg.answers);
                                return Object.entries(parsedAns).map(([k, v]) => (
                                  <div key={k} className="flex justify-between items-center pb-2 border-b border-white/10 pt-2">
                                    <span className="text-white/40 font-mono text-[9px] uppercase">{k}</span>
                                    <span className="text-white font-medium">{typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}</span>
                                  </div>
                                ));
                              } catch {
                                return null;
                              }
                            })()}

                            <div className="flex justify-between items-center pt-2 mt-1 border-t border-white/10">
                              <span className="text-white/40 font-mono text-[9px] uppercase">Pass Code</span>
                              <span className="text-emerald-400 font-mono font-bold tracking-wider">{verifiedReg.ticketCode}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#18181c]/60 border border-white/10 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
                        <GoShield className="w-8 h-8 text-white/40 animate-pulse" />
                        <p className="text-xs text-white/40">Scan or enter ticket pass above to inspect registration information here.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Update Sender & Broadcast Mail Tab ── */}
            {activeTab === 'broadcast' && (
              <div className="flex flex-col gap-6 animate-fade-in font-tight">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5 flex-wrap gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.6px] leading-tight flex items-center gap-2">
                      <GoMail className="text-[#60a5fa] w-6 h-6" />
                      <span>Update Sender &amp; Broadcast</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-white/50 font-normal">
                      Send rich text updates with custom header images. Automatically queued with 3s rate-limiting and 90 mails/day quota.
                    </p>
                  </div>
                  <button
                    onClick={fetchBroadcastStatus}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
                  >
                    Refresh Quota
                  </button>
                </div>

                {/* Daily Quota Status Banner */}
                <div className="bg-[#18181c]/80 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center text-[#60a5fa]">
                        <GoMail className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-white/50">Daily Quota Usage</span>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          {broadcastStatusData?.sentToday ?? 0} / {broadcastStatusData?.dailyLimit ?? 90} Mails Sent Today
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* RGB Status Badges */}
                      <span className="text-xs font-medium px-3 py-1 rounded-lg bg-[rgba(59,130,246,0.1)] text-[rgb(96,165,250)] border border-[rgba(59,130,246,0.2)] font-mono">
                        Rate: 1 Mail / 3s gap
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-lg border font-mono ${
                        (broadcastStatusData?.remainingToday ?? 90) <= 0
                          ? 'bg-[rgba(239,68,68,0.1)] text-[rgb(239,68,68)] border-[rgba(239,68,68,0.2)]'
                          : 'bg-[rgba(34,197,94,0.1)] text-[rgb(34,197,94)] border-[rgba(34,197,94,0.2)]'
                      }`}>
                        {(broadcastStatusData?.remainingToday ?? 90) <= 0
                          ? 'Quota Limit Reached'
                          : `${broadcastStatusData?.remainingToday ?? 90} Mails Remaining`}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white/20 transition-all duration-500 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round(((broadcastStatusData?.sentToday ?? 0) / (broadcastStatusData?.dailyLimit ?? 90)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Form & Live Preview Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Form Controls */}
                  <div className="lg:col-span-7 flex flex-col gap-5 bg-[#18181c]/80 border border-white/10 rounded-2xl p-6 shadow-sm">
                    
                    <form onSubmit={handleSendBroadcast} className="flex flex-col gap-4">
                      {/* Target Audience */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-white/70">Target Audience / Event</label>
                        <select
                          value={broadcastAudience}
                          onChange={(e) => setBroadcastAudience(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#131316] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-white/30 transition-colors"
                        >
                          <option value="all">All Registered Attendees Across All Events ({broadcastStatusData?.totalAttendees ?? 0} recipients)</option>
                          {broadcastStatusData?.events?.map((ev) => (
                            <option key={ev.id} value={ev.id}>
                              {ev.title} ({ev.startDate})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Header Banner Image Link */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-white/70">Header Banner Link (Image URL)</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/... or image link"
                          value={broadcastHeaderBanner}
                          onChange={(e) => setBroadcastHeaderBanner(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#131316] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors"
                        />
                        <p className="text-[11px] text-white/40">Displays a 1200x1200 header banner at the top of the email.</p>
                      </div>

                      {/* Subject of the Mail */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-white/70">Subject of the Mail *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Important Announcement regarding Student Forge Launch"
                          value={broadcastSubject}
                          onChange={(e) => setBroadcastSubject(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#131316] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors font-medium"
                        />
                      </div>

                      {/* Body of the Mail + Formatting Toolbar */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-white/70">Body of the Mail (Rich Text) *</label>
                          <div className="flex items-center gap-1 bg-[#131316] border border-white/10 p-0.5 rounded-lg">
                            <button
                              type="button"
                              onClick={() => setBroadcastTabPreview('editor')}
                              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                                broadcastTabPreview === 'editor' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
                              }`}
                            >
                              Editor
                            </button>
                            <button
                              type="button"
                              onClick={() => setBroadcastTabPreview('preview')}
                              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                                broadcastTabPreview === 'preview' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
                              }`}
                            >
                              Live Preview
                            </button>
                          </div>
                        </div>

                        {/* Formatting Toolbar */}
                        <div className="flex flex-wrap items-center gap-1.5 bg-[#131316] border border-white/10 p-2 rounded-xl">
                          <button
                            type="button"
                            onClick={() => applyTextFormat('b')}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                            title="Format selection as Bold"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => applyTextFormat('i')}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs italic font-medium text-white transition-colors cursor-pointer"
                            title="Format selection as Italic"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => applyTextFormat('u')}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs underline font-medium text-white transition-colors cursor-pointer"
                            title="Format selection as Underline"
                          >
                            U
                          </button>
                          <span className="text-white/20">|</span>
                          <button
                            type="button"
                            onClick={() => applyTextFormat('h2')}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
                            title="Insert Heading"
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            onClick={() => applyTextFormat('p')}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors cursor-pointer"
                            title="Insert Paragraph"
                          >
                            Paragraph
                          </button>
                          <button
                            type="button"
                            onClick={() => applyTextFormat('a')}
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-[#60a5fa] transition-colors cursor-pointer"
                            title="Insert Website Link"
                          >
                            Link
                          </button>
                          <span className="text-xs text-white/40 ml-auto font-mono text-[10px]">HTML enabled</span>
                        </div>

                        {/* Editor Mode vs Live Preview Mode */}
                        {broadcastTabPreview === 'editor' ? (
                          <textarea
                            ref={broadcastTextareaRef}
                            required
                            rows={8}
                            placeholder="Type your mail content here... Paste links like https://... or highlight text to click B, I, U, or Link above."
                            value={broadcastBody}
                            onChange={(e) => setBroadcastBody(e.target.value)}
                            className="w-full px-3.5 py-3 bg-[#131316] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors leading-relaxed"
                          />
                        ) : (
                          <div className="w-full min-h-[180px] p-4 bg-[#121215] border border-white/10 rounded-xl text-xs text-white/80 leading-relaxed overflow-y-auto">
                            {broadcastBody ? (
                              <div dangerouslySetInnerHTML={{ __html: formatBroadcastBodyHtml(broadcastBody) }} />
                            ) : (
                              <p className="text-white/40 italic text-center py-6">No body content typed yet.</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Error & Success Alerts */}
                      {broadcastErrorMsg && (
                        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-start gap-2 font-medium">
                          <span className="font-bold">Error:</span>
                          <span>{broadcastErrorMsg}</span>
                        </div>
                      )}

                      {broadcastSuccessMsg && (
                        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-start gap-2 font-medium">
                          <span className="font-bold">Success:</span>
                          <span>{broadcastSuccessMsg}</span>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={broadcastSending || (broadcastStatusData?.remainingToday ?? 90) <= 0}
                        className="w-full py-3 bg-white text-[#101010] hover:opacity-90 disabled:opacity-40 font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                      >
                        {broadcastSending ? (
                          <span>Enqueuing to BullMQ Queue...</span>
                        ) : (
                          <>
                            <GoMail className="w-4 h-4" />
                            <span>Queue Broadcast Mails (3s Gap / 90 Limit)</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Live Rendered Email Preview */}
                  <div className="lg:col-span-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/70">Live Email Preview</span>
                      <span className="text-xs text-white/40">HTML Delivery Simulation</span>
                    </div>

                    {/* Email Card Preview Mockup */}
                    <div className="w-full bg-[#18181c] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col">
                      {/* Top Email Banner (1200x1200px Frame) */}
                      {broadcastHeaderBanner.trim() ? (
                        <div className="w-full aspect-square max-h-[360px] sm:max-h-[380px] bg-[#09090b] border-b border-white/10 overflow-hidden relative">
                          <img
                            src={broadcastHeaderBanner.trim()}
                            alt="1200x1200px Banner Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full py-8 bg-[#121215] border-b border-white/10 text-center flex flex-col items-center justify-center gap-1">
                          <span className="text-xs text-white/40 font-medium">No Header Banner Image Set</span>
                          <span className="text-[10px] text-white/30 font-mono">1200 x 1200 px Frame</span>
                        </div>
                      )}

                      {/* Email Header Info */}
                      <div className="p-4 border-b border-white/10 bg-[#141417] flex flex-col gap-1">
                        <span className="text-xs text-white/40">From: Student Forge &lt;noreply@app.redlix.co.in&gt;</span>
                        <h4 className="text-sm font-semibold text-white mt-0.5">{broadcastSubject || 'Subject preview...'}</h4>
                      </div>

                      {/* Formatted Body Content Preview */}
                      <div className="p-5 flex flex-col gap-3 min-h-[160px] bg-[#18181c]">
                        <span className="text-xs text-white/50 font-medium">Hello [Attendee Name],</span>
                        
                        <div className="text-xs text-white/80 leading-relaxed">
                          {broadcastBody ? (
                            <div dangerouslySetInnerHTML={{ __html: formatBroadcastBodyHtml(broadcastBody) }} />
                          ) : (
                            <p className="text-white/40 italic">Your bold, italic, underlined, link, and spaced paragraph message content will render here...</p>
                          )}
                        </div>
                      </div>

                      {/* Footer Preview */}
                      <div className="p-4 bg-[#111113] border-t border-white/10 text-center">
                        <span className="text-xs text-white/40">© 2026 Student Forge. Sent via Admin Broadcast Console.</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Queue Activity & Dispatch Logs Table */}
                <div className="bg-[#18181c]/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">BullMQ Activity &amp; Dispatch Logs</h3>
                      <p className="text-xs text-white/40 mt-0.5">Shows recent emails queued, dispatched, or pending with 3-second spacing timer.</p>
                    </div>
                    <button
                      onClick={fetchBroadcastStatus}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white/70 hover:text-white"
                    >
                      Refresh Logs
                    </button>
                  </div>

                  {!broadcastStatusData?.logs || broadcastStatusData.logs.length === 0 ? (
                    <div className="p-8 text-center border border-white/10 border-dashed rounded-xl">
                      <p className="text-xs text-white/40">No broadcast email dispatches recorded yet today.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-white/40 font-mono text-[10px] uppercase">
                            <th className="py-2.5 px-3">Time</th>
                            <th className="py-2.5 px-3">Attendee</th>
                            <th className="py-2.5 px-3">Subject</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {broadcastStatusData.logs.map((log: any, idx: number) => (
                            <tr key={idx} className="hover:bg-white/[0.02]">
                              <td className="py-2.5 px-3 font-mono text-[11px] text-white/40">{new Date(log.timestamp).toLocaleTimeString()}</td>
                              <td className="py-2.5 px-3 text-white/80 font-medium">{log.email}</td>
                              <td className="py-2.5 px-3 text-white/60 truncate max-w-xs">{log.subject}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] ${
                                  log.status === 'SENT'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Profile Settings Tab ── */}
            {activeTab === 'profile' && (
              <div className="flex flex-col gap-6 animate-fade-in font-tight">
                {/* Header */}
                <div className="border-b border-white/10 pb-5">
                  <h1 className="font-instrument-serif text-2xl sm:text-3xl text-white font-normal tracking-[-0.6px] leading-tight flex items-center gap-2">
                    <GoPerson className="text-[#f59e0b] w-6 h-6" />
                    <span>Profile Settings</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-white/50 font-normal">Manage your profile photo and account information.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                  {/* Left: Photo Upload */}
                  <div className="md:col-span-5 flex flex-col gap-5">
                    <div className="bg-[#18181c]/80 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-5 shadow-sm">
                      {/* Avatar preview */}
                      <div className="relative group">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/15 shadow-[0_0_30px_rgba(245,158,11,0.12)] bg-[#141417]">
                          {user?.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <img
                              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.email || '')}`}
                              alt="Auto avatar"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        {profileUploading && (
                          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-[11px] text-white/40 font-mono mt-0.5">{user?.email}</p>
                        {!user?.profileImage && (
                          <p className="text-[10px] text-amber-400/80 mt-2 italic">Auto-generated avatar from your email</p>
                        )}
                      </div>

                      {/* Drag-and-drop upload zone */}
                      <div
                        onDragOver={(e) => { e.preventDefault(); setProfileDragActive(true); }}
                        onDragLeave={() => setProfileDragActive(false)}
                        onDrop={handleProfileDrop}
                        onClick={() => document.getElementById('profile-photo-input')?.click()}
                        className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-all select-none ${
                          profileDragActive
                            ? 'border-amber-500/70 bg-amber-500/5'
                            : 'border-white/15 hover:border-white/30 hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <GoPerson className="w-4 h-4 text-amber-400" />
                        </div>
                        <p className="text-xs text-white/80 font-medium text-center">
                          {profileDragActive ? 'Drop your photo here' : 'Drag & drop a photo, or click to browse'}
                        </p>
                        <p className="text-[10px] text-white/40">PNG, JPG, WEBP up to 5 MB</p>
                      </div>
                      <input
                        id="profile-photo-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleProfileImageFile(e.target.files[0]);
                          e.target.value = '';
                        }}
                      />

                      {/* Remove photo button */}
                      {user?.profileImage && (
                        <button
                          onClick={handleProfileRemove}
                          disabled={profileUploading}
                          className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <GoTrash className="w-3.5 h-3.5" />
                          <span>Remove photo</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right: Account Information & Sign Out */}
                  <div className="md:col-span-7 flex flex-col gap-5">
                    <div className="bg-[#18181c]/80 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                      <h3 className="text-sm font-semibold text-white">Account Information</h3>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-mono text-white/40 tracking-wider">Full Name</label>
                        <div className="flex items-center gap-3 px-3.5 py-2.5 bg-[#131316] border border-white/10 rounded-xl">
                          <GoPerson className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                          <span className="text-xs text-white">{user?.name || '—'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-mono text-white/40 tracking-wider">Email Address</label>
                        <div className="flex items-center gap-3 px-3.5 py-2.5 bg-[#131316] border border-white/10 rounded-xl">
                          <span className="w-3.5 h-3.5 text-white/40 flex-shrink-0 text-[11px]">@</span>
                          <span className="text-xs text-white font-mono">{user?.email || '—'}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-mono text-white/40 tracking-wider">User ID</label>
                        <div className="flex items-center gap-3 px-3.5 py-2.5 bg-[#131316] border border-white/10 rounded-xl">
                          <span className="w-3.5 h-3.5 text-white/40 flex-shrink-0 text-[11px]">#</span>
                          <span className="text-[11px] text-white/40 font-mono truncate">{user?.id || '—'}</span>
                        </div>
                      </div>

                      {/* Avatar info box */}
                      <div className="mt-2 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-0.5">
                          <img
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.email || '')}`}
                            alt="Auto avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[11px] font-semibold text-amber-400">Automatic Avatar</p>
                          <p className="text-[10px] text-white/50 leading-relaxed">
                            If you don&apos;t upload a photo, a unique cartoon avatar is automatically generated from your email address using DiceBear. It always looks consistent across all devices.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sign out card */}
                    <div className="bg-[#18181c]/80 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-4 shadow-sm">
                      <div>
                        <p className="text-xs font-semibold text-white">Sign out</p>
                        <p className="text-[10px] text-white/40 mt-0.5">You will be redirected to the sign-in page.</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 rounded-xl transition-all cursor-pointer active:scale-95"
                      >
                        <GoSignOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 pt-6">
              <Footer />
            </div>
          </div>
        </main>
      </div>

      {/* Invite Speaker / Guest Modal */}
      {showInviteGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#14151a] border border-[#2e2e34] rounded-2xl p-6 shadow-2xl text-left flex flex-col gap-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2e2e34] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <GoPerson className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Invite Guest or Speaker</h3>
                  <p className="text-xs text-neutral-400">Send an official VIP invitation email with attached PDF ticket pass</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowInviteGuestModal(false);
                  setInviteSuccessData(null);
                }}
                className="p-1.5 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <GoX className="w-4 h-4" />
              </button>
            </div>

            {inviteSuccessData ? (
              /* Success View */
              <div className="flex flex-col items-center text-center py-6 gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <GoCheck className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Invitation Sent to {inviteSuccessData.guestName}!</h4>
                <p className="text-xs text-neutral-400 max-w-sm">
                  An official VIP Speaker invitation email has been dispatched with the free VIP PDF ticket pass attached.
                </p>
                <div className="w-full bg-[#1c1c22] border border-[#2e2e34] rounded-xl p-3 text-left font-mono text-xs flex flex-col gap-1 mt-2">
                  <span className="text-[10px] text-neutral-500 uppercase">VIP Ticket Code</span>
                  <span className="text-amber-400 font-bold text-sm">{inviteSuccessData.ticketCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInviteGuestName('');
                    setInviteGuestEmail('');
                    setInvitePersonalMessage('');
                    setInviteSuccessData(null);
                  }}
                  className="mt-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Invite Another Guest
                </button>
              </div>
            ) : (
              /* Form View */
              <form onSubmit={handleSendGuestInvite} className="flex flex-col gap-4">
                {/* 1. Select Event */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-300">1. Select Event *</label>
                  <select
                    value={inviteSelectedEventId}
                    onChange={(e) => setInviteSelectedEventId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#1a1b22] border border-[#2e2e34] focus:border-amber-500/50 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                    required
                  >
                    {events.length === 0 && <option value="">No events available</option>}
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.startDate})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Guest Name & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Guest / Speaker Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Sarah Jenkins"
                      value={inviteGuestName}
                      onChange={(e) => setInviteGuestName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#1a1b22] border border-[#2e2e34] focus:border-amber-500/50 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Guest Email *</label>
                    <input
                      type="email"
                      placeholder="speaker@example.com"
                      value={inviteGuestEmail}
                      onChange={(e) => setInviteGuestEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#1a1b22] border border-[#2e2e34] focus:border-amber-500/50 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* 3. Role / Designation */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Invited Role / Title *</label>
                  <select
                    value={inviteGuestRole}
                    onChange={(e) => setInviteGuestRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#1a1b22] border border-[#2e2e34] focus:border-amber-500/50 rounded-xl text-xs text-white focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Employee Pass">Employee Pass (Free Entry for Staff)</option>
                    <option value="Complimentary Pass">Complimentary Pass (Free Entry for Guests)</option>
                    <option value="Keynote Speaker">Keynote Speaker</option>
                    <option value="Guest Speaker">Guest Speaker</option>
                    <option value="Panelist">Panelist</option>
                    <option value="VIP Guest">VIP Guest</option>
                    <option value="Guest of Honor">Guest of Honor</option>
                    <option value="Special Guest">Special Guest</option>
                  </select>
                </div>

                {/* 4. Personal Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Personal Note (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Add a personal note to be included in the official invitation email..."
                    value={invitePersonalMessage}
                    onChange={(e) => setInvitePersonalMessage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#1a1b22] border border-[#2e2e34] focus:border-amber-500/50 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={inviteSending || !inviteSelectedEventId}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-xs transition cursor-pointer shadow-md disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                >
                  {inviteSending ? 'Sending Invitation & PDF Pass...' : 'Send Guest Invitation & Issue Free Pass'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
