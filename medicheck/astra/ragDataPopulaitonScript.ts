//https://youtu.be/d-VKYF4Zow0?si=v5FHkidSO8aTeRsP
import { DataAPIClient } from "@datastax/astra-db-ts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import OpenAI from "openai";
import "dotenv/config"

// const {
//   process.env.ASTRA_DB_API_ENDPOINT,
//   process.env.ASTRA_DB_APPLICATION_TOKEN,
//   process.env.ASTRA_DB_COLLECTION,
//   OPENAI_API_KEY,
// } = process.env

console.log(process.env.OPENAI_API_KEY)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY})

type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

// Initialize the client
const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
if (!process.env.ASTRA_DB_API_ENDPOINT) {
  throw new Error('ASTRA_DB_API_ENDPOINT is not defined');
}
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);

const medData = ["https://www.mayoclinic.org",
  "https://www.webmd.com",
  "https://www.healthline.com",
  "https://www.medlineplus.gov",
  "https://www.cdc.gov",
  "https://www.nih.gov",
  "https://www.merckmanuals.com"];

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100
});
const collectionName = process.env.ASTRA_DB_COLLECTION || "RagMedDocs";
const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
  const res = await db.createCollection(collectionName, {
    vector: {
      dimension: 1536,
      metric: similarityMetric
    }
  });

  console.log(res)
}

const loadSampleData = async () => {
  const collection = await db.collection(collectionName)
  for await ( const url of medData) {
    const content = await scrapePage(url)
    const chunks = await splitter.splitText(content)
    for await ( const chunk of chunks) {
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
        encoding_format: "float"
      })

      const vector = embedding.data[0].embedding

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk
      })

    }
  }
}

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true
    },
    gotoOptions: {
      waitUntil: "domcontentloaded"
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML)
      await browser.close()
      return result
    }
  })

  return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection().then(() => loadSampleData())


// (async () => {
//   const colls = await db.listCollections();
//   console.log('Connected to AstraDB:', colls);
// })();