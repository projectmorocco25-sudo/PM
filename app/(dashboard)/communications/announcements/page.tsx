/**
 * Wireframe: task-0.5.1.28-system-announcements.md
 * Route: /communications/announcements
 * Implements: System announcements page (MOH Tier 1 only) with announcement list and create announcement functionality.
 * Wireframe Link: ../../../../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.28-system-announcements.md
 */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { useUserPermissions } from '@/lib/hooks/use-user-permissions';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Plus, Check, CheckCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROLES } from '@/lib/constants/roles';

interface Announcement {
  id: string;
  subject: string;
  content: string;
  recipient_scope: string;
  created_at: string;
  status: string;
  read_count?: number;
  total_recipients?: number;
}

export default function AnnouncementsPage() {
  const [user, setUser] = useState<User | null>(null);
  const { permissions, loading: permissionsLoading } = useUserPermissions(user);
  const role = permissions?.role ?? null;
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const supabase = createClient();

  const isTier1 = role === ROLES.TIER1;

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await createClient().auth.getUser();
      setUser(u);
    })();
  }, []);

  useEffect(() => {
    if (!permissionsLoading) {
      const fetchAnnouncements = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const { data, error: rpcError } = await supabase.rpc('communications_list_announcements', {
            p_limit: 50,
            p_offset: 0,
          });

          if (rpcError) throw rpcError;

          setAnnouncements(data || []);
        } catch (err) {
          console.error('Error fetching announcements:', err);
          setError(err instanceof Error ? err.message : 'Failed to load announcements');
        } finally {
          setIsLoading(false);
        }
      };

      fetchAnnouncements();
    }
  }, [supabase, permissionsLoading]);

  if (permissionsLoading || isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-text-secondary">Loading announcements...</div>
      </div>
    );
  }

  if (!isTier1) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="rounded-lg border border-error-500 bg-error-50 p-8 text-center">
          <h1 className="mb-4 text-2xl font-semibold text-text-primary">Access Denied</h1>
          <p className="text-text-secondary">
            System announcements can only be created and managed by MOH Tier 1 users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-text-secondary">
        <Link href="/dashboard" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/communications/inbox" className="hover:text-text-primary transition-colors">
          Communications
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">System Announcements</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-text-primary">System Announcements</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
        >
          <Plus className="h-4 w-4" />
          Create Announcement
        </button>
      </div>

      {/* Create Announcement Form (Modal/Expanded) */}
      {showCreateForm && (
        <CreateAnnouncementForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            // Refresh announcements
            window.location.reload();
          }}
        />
      )}

      {/* Announcements List */}
      {error ? (
        <div className="text-center text-error-500">Error: {error}</div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-default bg-white p-12 text-center">
          <p className="mb-2 text-lg font-semibold text-text-primary">No announcements</p>
          <p className="mb-6 text-text-secondary">No system announcements have been created yet.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="rounded-md bg-primary-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-600"
          >
            Create Announcement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="rounded-lg border border-default bg-white p-6 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-text-primary">{announcement.subject}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-text-secondary">
                    Broadcast: {formatDistanceToNowStrict(new Date(announcement.created_at), { addSuffix: true })}
                  </span>
                  <span className="text-sm text-text-secondary">To: {announcement.recipient_scope}</span>
                </div>
              </div>
              <p className="mb-4 text-base text-text-secondary line-clamp-3">{announcement.content}</p>
              <div className="flex items-center gap-4">
                <Link
                  href={`/communications/inbox/${announcement.id}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  View
                </Link>
                <button className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  Edit
                </button>
                <button className="text-sm font-medium text-error-500 hover:text-error-700 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateAnnouncementForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recipientScope, setRecipientScope] = useState('all_users');
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    try {
      const { error: createError } = await supabase.rpc('communications_create_announcement', {
        p_subject: title,
        p_content: content,
        p_recipient_scope: recipientScope,
      });

      if (createError) throw createError;

      onSuccess();
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-8 rounded-lg border border-default bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-text-primary">Create Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-text-primary">
            Title <span className="text-error-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter announcement title..."
            className="h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary placeholder:text-text-tertiary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block text-sm font-medium text-text-primary">
            Content <span className="text-error-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            placeholder="Enter announcement content..."
            className="w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary placeholder:text-text-tertiary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
          />
        </div>

        <div>
          <label htmlFor="recipient-scope" className="mb-2 block text-sm font-medium text-text-primary">
            Recipients <span className="text-error-500">*</span>
          </label>
          <select
            id="recipient-scope"
            value={recipientScope}
            onChange={(e) => setRecipientScope(e.target.value)}
            required
            className="h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
          >
            <option value="all_users">All Users</option>
            <option value="all_companies">All Companies</option>
            <option value="moh_only">MOH Only</option>
          </select>
        </div>

        {/* Regulatory Notice */}
        <div className="rounded-md border border-primary-500 bg-primary-50 p-4">
          <p className="text-sm text-text-secondary">
            <strong>Regulatory Notice:</strong> Announcements are retained for 7 years per regulatory requirements
            (Law No. 09-08). Announcements become part of communication audit trail.
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-default bg-white px-6 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !title.trim() || !content.trim()}
            className={cn(
              'flex items-center gap-2 rounded-md bg-primary-500 px-6 py-2 font-medium text-white transition-colors',
              'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:bg-gray-400',
              isSaving && 'cursor-wait'
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Broadcasting...
              </>
            ) : (
              'Broadcast'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
