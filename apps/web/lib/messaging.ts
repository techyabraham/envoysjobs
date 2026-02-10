"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";

export type Conversation = {
  id: string;
  jobId: string;
  createdAt?: string;
  job?: { title: string } | null;
  messages?: { text: string; createdAt?: string; senderId?: string }[];
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt?: string;
  attachments?: { url: string; type: string }[];
};

export function useConversations(userId?: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["conversations", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const res = await api<Conversation[]>(`/conversations?userId=${userId}`);
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useConversationMessages(conversationId?: string) {
  const api = useApi();
  return useQuery({
    queryKey: ["messages", conversationId],
    enabled: Boolean(conversationId),
    queryFn: async () => {
      const res = await api<Message[]>(`/conversations/${conversationId}/messages`);
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useSendMessage() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { conversationId: string; text: string }) => {
      const res = await api<Message>(`/conversations/${params.conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text: params.text })
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: ["messages", params.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
}

export function useCreateConversation() {
  const api = useApi();
  return useMutation({
    mutationFn: async (params: { jobId: string; envoyId: string; hirerId: string }) => {
      const res = await api<{ id: string }>(`/conversations`, {
        method: "POST",
        body: JSON.stringify(params)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    }
  });
}

export function useSendAttachment() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { conversationId: string; file: File; text?: string }) => {
      const form = new FormData();
      form.append("file", params.file);
      if (params.text) form.append("text", params.text);
      const res = await api<Message>(`/conversations/${params.conversationId}/attachments`, {
        method: "POST",
        body: form,
        headers: {}
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: ["messages", params.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
}
