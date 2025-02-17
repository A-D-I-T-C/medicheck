// 'use server';

import { getChatsByUserId, getChatById, getDocumentsByUserId } from '@/lib/db/queries';

export async function getChatsByUserIdHandler(userId: string) {
  try {
    const chats = await getChatsByUserId({ id: userId });
    return chats;
  } catch (error) {
    console.error('Failed to fetch chats by user ID:', error);
    throw new Error('Failed to fetch chats by user ID');
  }
}

export async function getChatByIdHandler(chatId: string) {
  try {
    const chat = await getChatById({ id: chatId });
    return chat;
  } catch (error) {
    console.error('Failed to fetch chat by ID:', error);
    throw new Error('Failed to fetch chat by ID');
  }
}

export async function getDocumentsByUserIdHandler(userId: string) {
  try {
    const documents = await getDocumentsByUserId({ id: userId });
    return documents;
  } catch (error) {
    console.error('Failed to fetch documents by user ID:', error);
    throw new Error('Failed to fetch documents by user ID');
  }
}
