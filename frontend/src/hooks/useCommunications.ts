import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type ConversationRow = {
  id: string;
  type: string;
  subject: string;
  company_id: string | null;
  workflow_entity_type: string | null;
  workflow_entity_id: string | null;
  lifecycle_state: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  is_announcement: boolean;
  announcement_expires_at: string | null;
  messages?: Array<{
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    recipient_id: string | null;
    delivered_at: string | null;
  }>;
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
  updated_at: string;
  edited_at: string | null;
  deleted_at: string | null;
};

async function fetchConversations(params: {
  archived?: boolean;
  createdBy?: string;
  limit: number;
  search?: string;
  type?: string;
}) {
  const supabase = createSupabaseBrowserClient();
  let q = supabase
    .from("conversations")
    .select(
      "id,type,subject,company_id,workflow_entity_type,workflow_entity_id,lifecycle_state,created_by,created_at,updated_at,archived_at,is_announcement,announcement_expires_at,messages(id,content,created_at,sender_id,recipient_id,delivered_at)",
    )
    .order("updated_at", { ascending: false })
    .order("created_at", { foreignTable: "messages", ascending: false })
    .limit(1, { foreignTable: "messages" })
    .limit(params.limit);

  if (params.archived) q = q.eq("lifecycle_state", "ARCHIVED");
  else q = q.neq("lifecycle_state", "ARCHIVED");

  if (params.createdBy) q = q.eq("created_by", params.createdBy);
  if (params.type) q = q.eq("type", params.type);
  if (params.search) q = q.ilike("subject", `%${params.search}%`);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as ConversationRow[];
}

async function fetchConversation(conversationId: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("conversations")
    .select(
      "id,type,subject,company_id,workflow_entity_type,workflow_entity_id,lifecycle_state,created_by,created_at,updated_at,archived_at,is_announcement,announcement_expires_at",
    )
    .eq("id", conversationId)
    .maybeSingle();
  if (error) throw error;
  return data as ConversationRow | null;
}

async function fetchMessages(conversationId: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("messages")
    .select("id,conversation_id,sender_id,recipient_id,content,is_system_message,delivered_at,created_at,updated_at,edited_at,deleted_at")
    .eq("conversation_id", conversationId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MessageRow[];
}

async function rpcSendMessage(params: {
  conversationId: string;
  recipientId?: string | null;
  content: string;
}) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("communications_send_message", {
    p_conversation_id: params.conversationId,
    p_recipient_id: params.recipientId ?? null,
    p_content: params.content,
    p_is_system_message: false,
  });
  if (error) throw error;
}

async function rpcCreateConversation(params: {
  type: string;
  subject: string;
  companyId?: string | null;
  workflowEntityType?: string | null;
  workflowEntityId?: string | null;
}) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("communications_create_conversation", {
    p_type: params.type,
    p_subject: params.subject,
    p_company_id: params.companyId ?? null,
    p_workflow_entity_type: params.workflowEntityType ?? null,
    p_workflow_entity_id: params.workflowEntityId ?? null,
    p_is_announcement: false,
    p_announcement_expires_at: null,
  });
  if (error) throw error;
  const payload = data as unknown as { data?: { id?: string } } | null;
  const id = payload?.data?.id;
  if (!id) throw new Error("Conversation creation did not return an id");
  return id;
}

async function rpcArchiveConversation(conversationId: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("communications_archive_conversation", {
    p_conversation_id: conversationId,
  });
  if (error) throw error;
}

async function rpcMarkMessageRead(messageId: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("communications_mark_read", {
    p_message_id: messageId,
  });
  if (error) throw error;
}

async function rpcCreateAnnouncement(params: { subject: string; content: string; expiresAt?: string | null }) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.rpc("communications_create_announcement", {
    p_subject: params.subject,
    p_content: params.content,
    p_announcement_expires_at: params.expiresAt ?? null,
    p_target_company_ids: null,
  });
  if (error) throw error;
}

export function useInboxConversations(search: string, limit = 25) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["communications", "inbox", { search, limit }],
    queryFn: () => fetchConversations({ archived: false, limit, search: search || undefined }),
  });

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel("realtime:communications:inbox")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => void qc.invalidateQueries({ queryKey: ["communications", "inbox"] }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => void qc.invalidateQueries({ queryKey: ["communications", "inbox"] }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return query;
}

export function useSentConversations(userId: string | null | undefined, search: string, limit = 25) {
  return useQuery({
    queryKey: ["communications", "sent", { userId: userId ?? null, search, limit }],
    queryFn: () => fetchConversations({ archived: false, createdBy: userId as string, limit, search: search || undefined }),
    enabled: Boolean(userId),
  });
}

export function useArchivedConversations(search: string, limit = 25) {
  return useQuery({
    queryKey: ["communications", "archived", { search, limit }],
    queryFn: () => fetchConversations({ archived: true, limit, search: search || undefined }),
  });
}

export function useConversation(conversationId: string | null | undefined) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["communications", "conversation", { conversationId: conversationId ?? null }],
    queryFn: () => fetchConversation(conversationId as string),
    enabled: Boolean(conversationId),
  });

  useEffect(() => {
    if (!conversationId) return;
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`realtime:communications:conversation:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations", filter: `id=eq.${conversationId}` },
        () => void qc.invalidateQueries({ queryKey: ["communications", "conversation", { conversationId }] }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, qc]);

  return query;
}

export function useConversationMessages(conversationId: string | null | undefined) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["communications", "messages", { conversationId: conversationId ?? null }],
    queryFn: () => fetchMessages(conversationId as string),
    enabled: Boolean(conversationId),
  });

  useEffect(() => {
    if (!conversationId) return;
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`realtime:communications:messages:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        () => void qc.invalidateQueries({ queryKey: ["communications", "messages", { conversationId }] }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, qc]);

  return query;
}

export function useSendMessage(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { recipientId?: string | null; content: string }) =>
      rpcSendMessage({ conversationId, recipientId: params.recipientId ?? null, content: params.content }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["communications", "messages", { conversationId }] });
      await qc.invalidateQueries({ queryKey: ["communications", "inbox"] });
    },
  });
}

export function useCreateConversationAndSend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { type: string; subject: string; content: string; recipientId?: string | null }) => {
      const conversationId = await rpcCreateConversation({ type: params.type, subject: params.subject });
      await rpcSendMessage({ conversationId, recipientId: params.recipientId ?? null, content: params.content });
      return conversationId;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["communications", "inbox"] });
    },
  });
}

export function useArchiveConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => rpcArchiveConversation(conversationId),
    onSuccess: async (_data, conversationId) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["communications", "inbox"] }),
        qc.invalidateQueries({ queryKey: ["communications", "conversation", { conversationId }] }),
      ]);
    },
  });
}

export function useMarkMessageRead(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (messageId: string) => rpcMarkMessageRead(messageId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["communications", "messages", { conversationId }] });
    },
  });
}

export function useCreateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { subject: string; content: string; expiresAt?: string | null }) => rpcCreateAnnouncement(params),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["communications", "inbox"] });
    },
  });
}

