'use server';

import { getPatients, getUserById, getDocumentsByUserId } from '@/lib/db/queries';

export default async function handler() {
  try {
    const patients = await getPatients();
    return patients;
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    throw new Error('Failed to fetch patients');
  }
}

export async function getDetails(id: string) {
  try {
    const userDetails = await getUserById(id);
    const userDocuments = await getDocumentsByUserId(id);
    return { userDetails, userDocuments };
  } catch (error) {
    console.error('Failed to fetch details:', error);
    throw new Error('Failed to fetch details');
  }
}