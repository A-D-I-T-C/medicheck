import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { ArtifactKind } from '@/components/artifact';
import {
  deleteDocumentsByIdAfterTimestamp,
  getDocumentsById,
  saveDocument,
} from '@/lib/db/queries';

// --- Dewy imports & client ---
import { Dewy } from 'dewy-ts';

export const runtime = 'edge';

// Create a Dewy client
const dewy = new Dewy({
  BASE: process.env.DEWY_ENDPOINT,
});

// GET: unchanged from your existing code with fixed JSON response
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const session = await auth();
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const documents = await getDocumentsById({ id });
  const [document] = documents;

  if (!document) {
    return new Response('Not Found', { status: 404 });
  }

  if (document.userId !== session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  return NextResponse.json(documents, { status: 200 });
}

// POST: handles both multipart/form-data uploads to Dewy and JSON-based logic
export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';

  // 1) Handle multipart/form-data for Dewy uploads
  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await request.formData();
      const url = formData.get('url');

      if (!url) {
        return new Response('Missing "url" in form data', { status: 400 });
      }
      const DEWY_ENDPOINT = process.env.DEWY_ENDPOINT;
      const DEWY_COLLECTION = process.env.DEWY_COLLECTION;

      const document = await dewy.kb.addDocument({
      collection: DEWY_COLLECTION,
      url: String(url),
    });
      return NextResponse.json({ document_id: document.id });
    } catch (error) {
      console.error('Dewy upload error:', error);
      return new Response('Error uploading to Dewy', { status: 500 });
    }
  }

  // 2) JSON-based logic
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const session = await auth();
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { content, title, kind }: { content: string; title: string; kind: ArtifactKind } =
    await request.json();

  const document = await saveDocument({
    id,
    content,
    title,
    kind,
    userId: session.user.id,
  });

  return NextResponse.json(document, { status: 200 });
}

// PATCH: unchanged from your existing code with an added document existence check
export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const { timestamp }: { timestamp: string } = await request.json();

  const session = await auth();
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const documents = await getDocumentsById({ id });
  const [document] = documents;

  if (!document) {
    return new Response('Not Found', { status: 404 });
  }

  if (document.userId !== session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  await deleteDocumentsByIdAfterTimestamp({
    id,
    timestamp: new Date(timestamp),
  });

  return new Response('Deleted', { status: 200 });
}
