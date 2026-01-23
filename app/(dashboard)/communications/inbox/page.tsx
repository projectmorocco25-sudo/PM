/**
 * Wireframe: task-0.5.1.24-communications-inbox-list.md
 * Route: /communications/inbox
 * Implements: Communications inbox page with conversation list, filters, and search.
 * Wireframe Link: ../../../../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.24-communications-inbox-list.md
 */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNowStrict } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { Search, MessageSquare, Filter, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Conversation {
  id: string;
  subject: string;
  from_name: string;
  from_role: string;
  preview: string;
  created_at: string;
  is_read: boolean;
  message_count: number;
  lifecycle_state: string;
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    entity: 'all',
    company: 'all',
    dateRange: 'all',
  });
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: rpcError } = await supabase.rpc('communications_list_conversations', {
          p_limit: 50,
          p_offset: 0,
        });

        if (rpcError) throw rpcError;

        setConversations(data || []);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [supabase]);

  const filteredConversations = conversations.filter((conv) => {
    if (searchQuery && !conv.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Additional filtering logic based on filters state
    return true;
  });

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-text-secondary">
        <Link href="/dashboard" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/communications" className="hover:text-text-primary transition-colors">
          Communications
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">Inbox</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-text-primary">Inbox</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/communications/compose"
            className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
          >
            <Plus className="h-4 w-4" />
            New Message
          </Link>
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors" title="Filters">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-default bg-white pl-10 pr-4 text-base text-text-primary placeholder:text-text-tertiary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
          />
        </div>
      </div>

      {/* Conversations List */}
      {isLoading ? (
        <div className="text-center text-text-secondary">Loading conversations...</div>
      ) : error ? (
        <div className="text-center text-error-500">Error: {error}</div>
      ) : filteredConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-default bg-white p-12 text-center">
          <MessageSquare className="mb-4 h-12 w-12 text-text-tertiary" />
          <p className="mb-2 text-lg font-semibold text-text-primary">No conversations</p>
          <p className="mb-6 text-text-secondary">You don&apos;t have any conversations yet.</p>
          <Link
            href="/communications/compose"
            className="rounded-md bg-primary-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-600"
          >
            Compose Message
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-default bg-white shadow-sm">
          {filteredConversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/communications/inbox/${conversation.id}`}
              className={cn(
                'flex items-center gap-4 border-b border-default p-4 transition-colors hover:bg-bg-secondary',
                !conversation.is_read && 'bg-primary-50'
              )}
            >
              <div className="flex-shrink-0">
                {!conversation.is_read ? (
                  <span className="h-2 w-2 rounded-full bg-primary-500" aria-label="Unread" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-transparent" />
                )}
              </div>
              <div className="flex-grow">
                <div className="mb-1 flex items-start justify-between">
                  <h3
                    className={cn(
                      'text-base font-medium',
                      !conversation.is_read ? 'font-semibold text-text-primary' : 'text-text-secondary'
                    )}
                  >
                    {conversation.subject}
                  </h3>
                  <span className="text-xs text-text-tertiary">
                    {formatDistanceToNowStrict(new Date(conversation.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="mb-1 text-sm text-text-secondary">
                  From: {conversation.from_name} ({conversation.from_role})
                </p>
                <p className="line-clamp-2 text-sm text-text-secondary">{conversation.preview}</p>
                {conversation.message_count > 1 && (
                  <span className="mt-1 inline-block rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700">
                    Thread ({conversation.message_count})
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
