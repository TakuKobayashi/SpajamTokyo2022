import awsLambdaFastify from '@fastify/aws-lambda';
import fastify from 'fastify';
import crypto from "crypto";
import { setupFireStore } from './common/firestore';
const firestore = setupFireStore();

const app = fastify();

app.get('/', async (request, reply) => {
  const buff = crypto.randomBytes(8).toString("hex");
  const currentDoc = firestore.collection("votes").doc(buff);
  await currentDoc.set({left: 1});
  const result = await currentDoc.get()
  return result.data();
});

app.get('/poling/vote', async (request, reply) => {
  return { left: 1, right: 1 };
});

export const handler = awsLambdaFastify(app);
