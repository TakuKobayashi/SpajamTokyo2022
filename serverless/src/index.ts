import awsLambdaFastify from '@fastify/aws-lambda';
import fastify from 'fastify';
//import crypto from "crypto";
import { S3Client, PutObjectCommand, PutObjectCommandInput, ObjectCannedACL, PutObjectCommandOutput } from '@aws-sdk/client-s3';
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

const s3JsonFileKey = "vote.json"

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
  await putVoteData(currentData);
  return currentData;
});

app.post('/vote/reset', async (request, reply) => {
  const currentDoc = firestore.collection('votes').doc(voteName);
  const initData = {left: 0, right: 0}
  await currentDoc.set(initData);
  await putVoteData(initData);
  return initData;
});

async function putVoteData(data: any): Promise<PutObjectCommandOutput> {
  const s3Client = new S3Client({ region: process.env.AWS_REGION });
  const input: PutObjectCommandInput = {
    Bucket: process.env.S3_BUCKERT_NAME,
    Key: s3JsonFileKey,
    Body: JSON.stringify(data),
    ACL: ObjectCannedACL.public_read,
    ContentType: "application/json"
  };
  const command = new PutObjectCommand(input);
  return s3Client.send(command);
}

app.get('/poling/vote', async (request, reply) => {
  reply.redirect(`https://${process.env.S3_BUCKERT_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3JsonFileKey}`)
});

export const handler = awsLambdaFastify(app);
