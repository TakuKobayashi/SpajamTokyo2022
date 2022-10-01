import awsLambdaFastify from '@fastify/aws-lambda';
import fastify from 'fastify';

const app = fastify();

app.get('/poling/vote', async (request, reply) => {
  return { left: 1, right: 1 };
});

export const handler = awsLambdaFastify(app);
