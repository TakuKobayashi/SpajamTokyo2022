import awsLambdaFastify from '@fastify/aws-lambda';
import fastify from 'fastify';
//import crypto from "crypto";
import { setupFireStore } from './common/firestore';
const firestore = setupFireStore();

// ランダムなIDを生成する場合はこちら
//const voteId = crypto.randomBytes(8).toString("hex");
const voteName = 'typhoon'

const app = fastify();

app.get('/', async (request, reply) => {
  const currentDoc = firestore.collection("votes").doc(voteName);
  const currentDataDoc = await currentDoc.get();
  const currentData = currentDataDoc.data() || {};
  const leftCount = currentData.left || 0
  await currentDoc.set({left: leftCount + 1});
  return currentData;
});

app.post('/vote', async (request, reply) => {
  const currentDoc = firestore.collection("votes").doc(voteName);
  const currentDataDoc = await currentDoc.get();
  const currentData = currentDataDoc.data() || {};
  const leftCount = currentData.left || 0
  await currentDoc.set({left: leftCount + 1});
  return currentData;
});

app.get('/poling/vote', async (request, reply) => {
  return { left: 1, right: 1 };
});

export const handler = awsLambdaFastify(app);
