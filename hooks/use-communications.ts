"use client";

/**
 * Communications inbox, conversation, compose, sent. Uses communications_list_conversations,
 * communications_get_conversation, communications_send_message, communications_archive_conversation,
 * communications_create_conversation, communications_list_sent.
 * Tables: conversations, messages, message_attachments. Hosted Supabase only.
 * Wireframes: task-0.5.1.24 (inbox), task-0.5.1.25 (conversation detail),
 * task-0.5.1.26 (compose), task-0.5.1.27 (sent),
 * task-0.5.1.28 (announcements), task-0.5.1.36 (archived).
 */

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type ConversationRow = {
  id: string;
  type: string;
  subject: string;
  company_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_announcement: boolean;
  archived_at: string | null;
};

export type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string | null;
  content: string;
  is_system_message: boolean;
  delivered_at: string | null;
  created_at: string;
};

type ListPayload = { data: ConversationRow[] };
type GetPayload =
  | { conversation: ConversationRow; messages: MessageRow[] }
  | { error: string; id?: string };
type SendPayload = { success: boolean; id?: string; error?: string };
type ArchivePayload = { success: boolean; error?: string };

/** Same shape as list_sent response items. */
export type SentRow = {
  id: string;
  type: string;
  subject: string;
  company_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type CreatePayload = { success: boolean; id?: string; message_id?: string; error?: string };
type SentListPayload = { data: SentRow[] };
type AnnouncementListPayload = { data: AnnouncementRow[] };
type ArchivedListPayload = { data: ArchivedRow[] };
type RestorePayload = { success: boolean; error?: string };

export function useInboxConversations() {
  const [items, setItems] = useState<ConversationRow[]>([]);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setStatus("loading");
    setError(null);
    const supabase = createClient();
    const { data: res, error: err } = await supabase.rpc("communications_list_conversations", {
      p_archived: false,
    });
    if (err) {
      setError(err.message);
      setStatus("error");
      setItems([]);
      return;
    }
    const pl = res as ListPayload | null;
    const list = Array.isArray(pl?.data) ? pl.data : [];
    setItems(list);
    setStatus(list.length ? "success" : "empty");
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { items, status, error, refetch: fetchList };
}

export function useConversation(conversationId: string | null) {
  const [conversation, setConversation] = useState<ConversationRow | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async () => {
    if (!conversationId) {
      setConversation(null);
      setMessages([]);
      setStatus("empty");
      setError(null);
      return;
    }
    setStatus("loading");
    setError(null);
    const supabase = createClient();
    const { data: res, error: err } = await supabase.rpc("communications_get_conversation", {
      p_conversation_id: conversationId,
    });
    if (err) {
      setError(err.message);
      setStatus("error");
      setConversation(null);
      setMessages([]);
      return;
    }
    const pl = res as GetPayload | null;
    if (pl && "error" in pl) {
      setError((pl as { error: string }).error);
      setStatus("error");
      setConversation(null);
      setMessages([]);
      return;
    }
    const g = pl as { conversation: ConversationRow; messages: MessageRow[] };
    setConversation(g.conversation ?? null);
    setMessages(Array.isArray(g.messages) ? g.messages : []);
    setStatus("success");
  }, [conversationId]);

  useEffect(() => {
    fetchOne();
  }, [fetchOne]);

  return { conversation, messages, status, error, refetch: fetchOne };
}

export function useSendMessage(conversationId: string | null, onSent?: () => void) {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (content: string, recipientId: string | null = null) => {
      if (!conversationId || !content?.trim()) {
        setError("Content is required.");
        setStatus("error");
        return;
      }
      setStatus("loading");
      setError(null);
      const supabase = createClient();
      const { data: res, error: err } = await supabase.rpc("communications_send_message", {
        p_conversation_id: conversationId,
        p_content: content.trim(),
        p_recipient_id: recipientId || null,
      });
      if (err) {
        setError(err.message);
        setStatus("error");
        return;
      }
      const pl = res as SendPayload | null;
      if (pl && !pl.success) {
        setError(pl.error ?? "Send failed.");
        setStatus("error");
        return;
      }
      setStatus("success");
      onSent?.();
    },
    [conversationId, onSent]
  );

  return { send, status, error };
}

export function useArchiveConversation(conversationId: string | null, onArchived?: () => void) {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const archive = useCallback(
    async () => {
      if (!conversationId) return;
      setStatus("loading");
      setError(null);
      const supabase = createClient();
      const { data: res, error: err } = await supabase.rpc("communications_archive_conversation", {
        p_conversation_id: conversationId,
      });
      if (err) {
        setError(err.message);
        setStatus("error");
        return;
      }
      const pl = res as ArchivePayload | null;
      if (pl && !pl.success) {
        setError(pl.error ?? "Archive failed.");
        setStatus("error");
        return;
      }
      setStatus("success");
      onArchived?.();
    },
    [conversationId, onArchived]
  );

  return { archive, status, error };
}

export function useCreateConversation() {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const create = useCallback(
    async (params: {
      subject: string;
      type?: string;
      company_id?: string | null;
      recipient_id?: string | null;
      initial_content?: string | null;
    }) => {
      const { subject, type, company_id, recipient_id, initial_content } = params;
      if (!subject?.trim()) {
        setError("Subject is required.");
        setStatus("error");
        return;
      }
      setStatus("loading");
      setError(null);
      setCreatedId(null);
      const supabase = createClient();
      const { data: res, error: err } = await supabase.rpc("communications_create_conversation", {
        p_subject: subject.trim(),
        p_type: type?.trim() || "workflow_related",
        p_company_id: company_id || null,
        p_recipient_id: recipient_id || null,
        p_initial_content: initial_content?.trim() || null,
      });
      if (err) {
        setError(err.message);
        setStatus("error");
        return;
      }
      const pl = res as CreatePayload | null;
      if (pl && !pl.success) {
        setError(pl.error ?? "Create failed.");
        setStatus("error");
        return;
      }
      setCreatedId(pl?.id ?? null);
      setStatus("success");
    },
    []
  );

  return { create, status, error, createdId };
}

export function useSentList() {
  const [items, setItems] = useState<SentRow[]>([]);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setStatus("loading");
    setError(null);
    const supabase = createClient();
    const { data: res, error: err } = await supabase.rpc("communications_list_sent");
    if (err) {
      setError(err.message);
      setStatus("error");
      setItems([]);
      return;
    }
    const pl = res as SentListPayload | null;
    const list = Array.isArray(pl?.data) ? pl.data : [];
    setItems(list);
    setStatus(list.length ? "success" : "empty");
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { items, status, error, refetch: fetchList };
}

export type AnnouncementRow = {
  id: string;
  type: string;
  subject: string;
  created_by: string;
  created_at: string;
  announcement_expires_at: string | null;
};

export type ArchivedRow = {
  id: string;
  type: string;
  subject: string;
  company_id: string | null;
  created_by: string;
  created_at: string;
  archived_at: string;
};

export function useAnnouncementsList() {
  const [items, setItems] = useState<AnnouncementRow[]>([]);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setStatus("loading");
    setError(null);
    const supabase = createClient();
    const { data: res, error: err } = await supabase.rpc("communications_list_announcements");
    if (err) {
      setError(err.message);
      setStatus("error");
      setItems([]);
      return;
    }
    const pl = res as AnnouncementListPayload | null;
    const list = Array.isArray(pl?.data) ? pl.data : [];
    setItems(list);
    setStatus(list.length ? "success" : "empty");
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { items, status, error, refetch: fetchList };
}

type CreateAnnouncementPayload = { success: boolean; id?: string; message_id?: string; error?: string };

export function useCreateAnnouncement(onCreated?: () => void) {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (params: { subject: string; content: string; expires_at?: string | null }) => {
      const { subject, content, expires_at } = params;
      if (!subject?.trim() || !content?.trim()) {
        setError("Subject and content are required.");
        setStatus("error");
        return;
      }
      setStatus("loading");
      setError(null);
      const supabase = createClient();
      const { data: res, error: err } = await supabase.rpc("communications_create_announcement", {
        p_subject: subject.trim(),
        p_content: content.trim(),
        p_expires_at: expires_at || null,
      });
      if (err) {
        setError(err.message);
        setStatus("error");
        return;
      }
      const pl = res as CreateAnnouncementPayload | null;
      if (pl && !pl.success) {
        setError(pl.error ?? "Create failed.");
        setStatus("error");
        return;
      }
      setStatus("success");
      onCreated?.();
    },
    [onCreated]
  );

  return { create, status, error };
}

export function useArchivedList() {
  const [items, setItems] = useState<ArchivedRow[]>([]);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setStatus("loading");
    setError(null);
    const supabase = createClient();
    const { data: res, error: err } = await supabase.rpc("communications_list_archived");
    if (err) {
      setError(err.message);
      setStatus("error");
      setItems([]);
      return;
    }
    const pl = res as ArchivedListPayload | null;
    const list = Array.isArray(pl?.data) ? pl.data : [];
    setItems(list);
    setStatus(list.length ? "success" : "empty");
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { items, status, error, refetch: fetchList };
}

export function useRestoreConversation(onRestored?: () => void) {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const restore = useCallback(
    async (conversationId: string) => {
      if (!conversationId) return;
      setStatus("loading");
      setError(null);
      const supabase = createClient();
      const { data: res, error: err } = await supabase.rpc("communications_restore_conversation", {
        p_conversation_id: conversationId,
      });
      if (err) {
        setError(err.message);
        setStatus("error");
        return;
      }
      const pl = res as RestorePayload | null;
      if (pl && !pl.success) {
        setError(pl.error ?? "Restore failed.");
        setStatus("error");
        return;
      }
      setStatus("success");
      onRestored?.();
    },
    [onRestored]
  );

  return { restore, status, error };
}
