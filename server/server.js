// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from 'langchain/document';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { VectorDBQAChain } from 'langchain/chains';

import { AttributeInfo } from 'langchain/schema/query_constructor';
import { SelfQueryRetriever } from 'langchain/retrievers/self_query';
import { PineconeTranslator } from 'langchain/retrievers/self_query/pinecone';
import { OpenAI } from 'langchain/llms/openai';

import { v4 as uuidv4 } from 'uuid';

import dotenv from 'dotenv';
dotenv.config();

const __dirname = dirname(fileURLToPath(new URL('.', import.meta.url)));

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// this creates readable names for the files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/server/uploads/');
  },
  filename: function (req, file, cb) {
    const suffix = Date.now() + '-';
    cb(null, suffix + file.originalname);
  },
});

const uploads = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('Hello World!!!!!');
});

/**
 * Handles the file upload and stores the file in the uploads folder
 * and into the pinecone vector database
 * @param path for api endpoint
 * @param array of files from the multer object
 * @param callback function for request and response
 * @returns response with the request body
 */
app.post('/addFile', uploads.array('files'), async (req, res) => {
  try {
    if (req.files) {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      console.log('upserting filename: ', req.files[req.files.length - 1].path);
      const loader = new PDFLoader(req.files[req.files.length - 1].path);
      const data = await loader.load();
      const output = await splitter.splitDocuments(data);

      // create embeddings for output
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
        batchSize: 512, // Default value if omitted is 512. Max is 2048
      });

      // create a vector store
      const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT,
      });

      const index = pinecone.index('pga-study-guide');
      const pageContents = output.map((doc) => doc.pageContent);
      const embeds = await embeddings.embedDocuments(pageContents);

      const vectors = output.map((doc, i) => ({
        id: uuidv4(),
        values: embeds[i],
        metadata: {
          text: doc.pageContent,
        },
      }));
      await index.upsert(vectors);

      // await PineconeStore.fromDocuments(output, embeddings, {
      //   pineconeIndex,
      //   maxConcurrency: 5,
      // });

      // const pineconeStore = new PineconeStore(embeddings, { pineconeIndex });
      // await pineconeStore.addDocuments(output);
    }

    res.send(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing the request.');
  }
});

/**
 * Handles the query from the vector database and returns the results
 * @param path for api endpoint
 * @param callback function for request and response
 * @returns response with the request body
 */
app.post('/query', async (req, res) => {
  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

  if (
    !process.env.PINECONE_API_KEY ||
    !process.env.PINECONE_ENVIRONMENT ||
    !process.env.PINECONE_INDEX
  ) {
    throw new Error(
      'PINECONE_ENVIRONMENT and PINECONE_API_KEY and PINECONE_INDEX must be set'
    );
  }

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );

  const model = new OpenAI();
  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  });

  const query = `I need an array of ${req.body.numQuestions} practice questions 
  with answers about the PGA.
  The format of the questions should be multiple choice.
  The questions should be about the bylaws of the PGA.
  I need the output to follow the following format:
  Question: <question>
  Option: <option1>
  Option: <option2> 
  Option: <option3>
  Option: <option4> 
  CorrectAnswer: <the correct answer to the question>
  `;
  console.log(query);
  const response = await chain.call({
    query: query,
  });
  console.log(response);

  res.send(response.text);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
