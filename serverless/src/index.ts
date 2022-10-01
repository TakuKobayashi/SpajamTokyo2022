import awsLambdaFastify from '@fastify/aws-lambda';
import fastify from 'fastify';
//import crypto from "crypto";
import { setupFireStore } from './common/firestore';
const firestore = setupFireStore();

// ランダムなIDを生成する場合はこちら
//const voteId = crypto.randomBytes(8).toString("hex");
const voteName = 'typhoon';

const app = fastify();

app.get('/', async (request, reply) => {
  return {hello: "world"};
});

app.post('/vote', async (request, reply) => {
  // parsed JSON
  const requestBody = request.body;
  const currentDoc = firestore.collection('votes').doc(voteName);
  const currentDataDoc = await currentDoc.get();
  const currentData = currentDataDoc.data() || {};
  if (requestBody.vote_type === 'left') {
    const leftCount = currentData.left || 0;
    currentData.left = leftCount + 1;
  } else if (requestBody.vote_type === 'right') {
    const rightCount = currentData.right || 0;
    currentData.right = rightCount + 1;
  }
  await currentDoc.set(currentData);
  return currentData;
});

app.get('/poling/vote', async (request, reply) => {
  return { left: 1, right: 1 };
});

export const handler = awsLambdaFastify(app);
