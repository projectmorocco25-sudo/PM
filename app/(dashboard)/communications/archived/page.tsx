/**
 * Wireframe: task-0.5.1.36-archived-conversations.md
 * Route: /communications/archived
 * Implements: Archived conversations page with list of archived conversations, filters, and restore functionality.
 * Wireframe Link: ../../../../../04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.36-archived-conversations.md
 */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { Search, Filter, Archive } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ArchivedConversation {
  id: string;
  subject: string;
  from_name: string;
  from_role: string;
  preview: string;
  archived_at: string;
  retention_until: string;
}

export default function ArchivedPage() {
  const [conversations, setConversations] = useState<ArchivedConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchArchived = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: rpcError } = await supabase.rpc('communications_list_archived', {
          p_limit: 50,
          p_offset: 0,
        });

        if (rpcError) throw rpcError;

        setConversations(data || []);
      } catch (err) {
        console.error('Error fetching archived conversations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load archived conversations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchived();
  }, [supabase]);

  const filteredConversations = conversations.filter((conv) => {
    if (searchQuery && !conv.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleRestoreSelected = async () => {
    // TODO: Implement restore functionality
    alert('Restore functionality to be implemented');
  };

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
        <span className="text-text-primary">Archived</span>
      </nav>

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-text-primary">Archived Conversations</h1>
        {selectedIds.length > 0 && (
          <button
            onClick={handleRestoreSelected}
            className="rounded-md border border-primary-500 bg-white px-4 py-2 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
          >
            Restore Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search archived conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-default bg-white pl-10 pr-4 text-base text-text-primary placeholder:text-text-tertiary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
          />
        </div>
      </div>

      {/* Archived Conversations List */}
      {isLoading ? (
        <div className="text-center text-text-secondary">Loading archived conversations...</div>
      ) : error ? (
        <div className="text-center text-error-500">Error: {error}</div>
      ) : filteredConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-default bg-white p-12 text-center">
          <Archive className="mb-4 h-12 w-12 text-text-tertiary" />
          <p className="mb-2 text-lg font-semibold text-text-primary">No archived conversations</p>
          <p className="text-text-secondary">You don&apos;t have any archived conversations yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-default bg-white shadow-sm">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex items-center gap-4 border-b border-default p-4 transition-colors hover:bg-bg-secondary last:border-b-0"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(conversation.id)}
                onChange={() => handleToggleSelect(conversation.id)}
                className="h-4 w-4 rounded border-default text-primary-600 focus:ring-2 focus:ring-primary-500"
              />
              <Link href={`/communications/inbox/${conversation.id}`} className="flex-grow">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="text-base font-medium text-text-primary">{conversation.subject}</h3>
                  <span className="text-xs text-text-tertiary">
                    Archived: {formatDistanceToNowStrict(new Date(conversation.archived_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="mb-1 text-sm text-text-secondary">
                  From: {conversation.from_name} ({conversation.from_role})
                </p>
                <p className="line-clamp-2 text-sm text-text-secondary">{conversation.preview}</p>
                <p className="mt-1 text-xs text-text-tertiary">
                  Retained until: {new Date(conversation.retention_until).toLocaleDateString()}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Data Retention Compliance Notice */}
      <div className="mt-8 rounded-lg border border-warning-500 bg-warning-50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-text-primary">
          ⚠️ Data Retention Compliance (Fatima&apos;s Requirement)
        </h2>
        <div className="space-y-2 text-sm text-text-secondary">
          <p>
            <strong>Retention Status:</strong>
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Data retained until [date + 7 years]</li>
            <li>Retention period: 7 years (regulatory minimum)</li>
            <li>Regulatory Basis: Law No. 09-08</li>
            <li>Immutability Warning: Historical data cannot be modified</li>
          </ul>
          <p className="mt-4">
            After 7 years, conversations are automatically removed from active archive but remain in audit logs for
            compliance purposes. No hard deletes are allowed.
          </p>
          <div className="mt-4 flex gap-4">
            <Link href="/legal/privacy" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View Retention Policy
            </Link>
            <Link href="/about" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View Regulatory Framework
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
