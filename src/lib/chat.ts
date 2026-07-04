import { supabase } from './supabase';
import type { ChatConversation, ChatMessage } from './types';

// Get all conversations for a user
export async function getUserConversations(userId: string): Promise<ChatConversation[]> {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    orderId: row.order_id,
    subject: row.subject,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archived: row.archived,
  }));
}

// Get all conversations for admin (all users)
export async function getAdminConversations(): Promise<ChatConversation[]> {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('archived', false)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin conversations:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    orderId: row.order_id,
    subject: row.subject,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archived: row.archived,
  }));
}

// Get a specific conversation
export async function getConversation(id: string): Promise<ChatConversation | null> {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching conversation:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    orderId: data.order_id,
    subject: data.subject,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    archived: data.archived,
  };
}

// Create a new conversation
export async function createConversation(
  userId: string,
  subject: string,
  orderId?: string
): Promise<ChatConversation | null> {
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      user_id: userId,
      subject,
      order_id: orderId,
      archived: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    orderId: data.order_id,
    subject: data.subject,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    archived: data.archived,
  };
}

// Get messages for a conversation
export async function getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    conversationId: row.conversation_id,
    userId: row.user_id,
    isAdmin: row.is_admin,
    content: row.content,
    createdAt: row.created_at,
    readAt: row.read_at,
  }));
}

// Send a message
export async function sendMessage(
  conversationId: string,
  userId: string,
  content: string,
  isAdmin: boolean = false
): Promise<ChatMessage | null> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      is_admin: isAdmin,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    return null;
  }

  // Update conversation's updated_at timestamp
  await supabase
    .from('chat_conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return {
    id: data.id,
    conversationId: data.conversation_id,
    userId: data.user_id,
    isAdmin: data.is_admin,
    content: data.content,
    createdAt: data.created_at,
    readAt: data.read_at,
  };
}

// Archive a conversation
export async function archiveConversation(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('chat_conversations')
    .update({ archived: true })
    .eq('id', id);

  if (error) {
    console.error('Error archiving conversation:', error);
    return false;
  }

  return true;
}

// Mark messages as read
export async function markMessagesAsRead(conversationId: string): Promise<boolean> {
  const { error } = await supabase
    .from('chat_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .is('read_at', null);

  if (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }

  return true;
}
