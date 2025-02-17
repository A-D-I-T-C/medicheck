import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';

import { auth } from '@/app/(auth)/auth';
import { myProvider } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY})
export const maxDuration = 60;

// async function generateEmbeddings(text: string): Promise<number[]> {
  
  
//   return new Array(defaultEmbeddingSize).fill(2);
// }


//TODO
// Function to fetch client data from PostgreSQL using session ID
async function fetchClientDataFromPg(sessionId: string) {
  // const userData = await getDocuments(sessionId);
  // return userData;
  return 0
}

function getUserRole(session: any): string {
  if (session.user.role === 'doctor') {
    return 'doctor';
  } else {
    return 'patient';
  }
}

// Function to fetch data from Astra DB using RAG
async function fetchDataFromAstraDBWithRAG(prompt: string, userData: any) {
  try {
    if (!process.env.ASTRA_DB_APPLICATION_TOKEN) {
      throw new Error('Missing ASTRA_DB_APPLICATION_TOKEN in environment variables.');
    }
    if (!process.env.ASTRA_DB_API_ENDPOINT) {
      throw new Error('ASTRA_DB_API_ENDPOINT is not defined');
    }

    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    const astraDb = client.db(process.env.ASTRA_DB_API_ENDPOINT);
    const collection = await astraDb.collection('RagMedDocs1');

    // Combine the prompt and user data into a single string
    const combinedInput = `${JSON.stringify(userData)}\n${prompt}`;
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: combinedInput,
      encoding_format: "float"
    })
    //const embeddings = await generateEmbeddings(combinedInput);

    const cursor = collection.find({}, {
      sort: {
        $vector: embedding.data[0].embedding, 
      },
      limit: 5, 
    });

    // Fetch the documents from Astra DB
    const result = await cursor.toArray();

    return result;
  } catch (error) {
    console.error('Error fetching data from Astra DB:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel,
  }: { id: string; messages: Array<Message>; selectedChatModel: string } =
    await request.json();

  const session = await auth();
  
  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  // Fetch client data from PostgreSQL using session ID
  let patientData;
  try {
    //TODO add caht id to documents and fetch documents based on chat id
    patientData = await fetchClientDataFromPg(session.user.id);
  } catch (error) {
    console.error('Failed to fetch patient data from Postgres DB:', error);
    return new Response('Failed to fetch data from Postgres DB', { status: 500 });
  }

  // Fetch data from Astra DB using RAG
  let astraData;
  try {
    astraData = await fetchDataFromAstraDBWithRAG(userMessage.content, patientData);
    console.log('Astra DB data:', astraData);
  } catch (error) {
    console.error('Failed to fetch data from Astra DB:', error);
    return new Response('Failed to fetch data from Astra DB', { status: 500 });
  }

  const combinedContext = `
    Patient Data: ${JSON.stringify(patientData)}
    Astra DB Context: ${astraData.map(doc => doc.content).join("\n")}
  `;

  const ragSystemPrompt = `
    ${systemPrompt({ selectedChatModel })}
    Additional Context:
    ${combinedContext}
  `;

  console.log(combinedContext);
  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  await saveMessages({
    messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
  });

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        system: ragSystemPrompt,
        messages: [
          ...messages,
          {
            role: 'system',
            content: `You are an Medical AI assistant that will help gather questions about the patient to make lifes easier for doctors.
              Be clear to indicate what you are supposed to do and also that you can be wrong about things
              you are current talking to the ${getUserRole(session)} 
              ${combinedContext} 
              If the answer is not provided in the context, the AI assistant will say,
              "I'm sorry, I don't know the answer".`
          },
        ],
        maxSteps: 5,
        experimental_activeTools:
          selectedChatModel === 'chat-model-reasoning'
            ? []
            : [
                'createDocument',
                'updateDocument',
                'requestSuggestions',
              ],
        experimental_transform: smoothStream({ chunking: 'word' }),
        experimental_generateMessageId: generateUUID,
        tools: {
          createDocument: createDocument({ session, dataStream }),
          updateDocument: updateDocument({ session, dataStream }),
          requestSuggestions: requestSuggestions({
            session,
            dataStream,
          }),
        },
        onFinish: async ({ response, reasoning }) => {
          if (session.user?.id) {
            try {
              const sanitizedResponseMessages = sanitizeResponseMessages({
                messages: response.messages,
                reasoning,
              });

              await saveMessages({
                messages: sanitizedResponseMessages.map((message) => {
                  return {
                    id: message.id,
                    chatId: id,
                    role: message.role,
                    content: message.content,
                    createdAt: new Date(),
                  };
                }),
              });
            } catch (error) {
              console.error('Failed to save chat');
            }
          }
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: 'stream-text',
        },
      });

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: () => {
      return 'Oops, an error occured!';
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
