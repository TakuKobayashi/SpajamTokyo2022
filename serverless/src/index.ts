import awsLambdaFastify from '@fastify/aws-lambda';
import fastify from 'fastify';
//import crypto from "crypto";
import cors from '@fastify/cors'
import { setupFireStore } from './common/firestore';
const firestore = setupFireStore();

// ランダムなIDを生成する場合はこちら
//const voteId = crypto.randomBytes(8).toString("hex");
const voteName = 'typhoon';

const app = fastify();
app.register(cors, {
  origin: (origin, cb) => {
    cb(null, true)
  }
});

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

app.post('/vote/reset', async (request, reply) => {
  const currentDoc = firestore.collection('votes').doc(voteName);
  const initData = {left: 0, right: 0}
  await currentDoc.set(initData);
  return initData;
});

app.get('/poling/vote', async (request, reply) => {
  return loadCurrentData();
});

async function loadCurrentData(): Promise<any> {
  const currentDoc = firestore.collection('votes').doc(voteName);
  const currentDataDoc = await currentDoc.get();
  const currentData = currentDataDoc.data() || {};
  const leftCount = currentData.left || 0;
  currentData.left = leftCount;
  const rightCount = currentData.right || 0;
  currentData.right = rightCount;
  return currentData;
}

export const handler = awsLambdaFastify(app);
