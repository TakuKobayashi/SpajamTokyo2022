import type { AWS } from '@serverless/typescript';

import { config } from 'dotenv';
const configedEnv = config();

const bucketName = 'spajam-tokyo-2022';

const serverlessConfiguration: AWS = {
  service: 'spajam-tokyo-2022',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'ap-northeast-1',
    timeout: 900,
    memorySize: 256,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      S3_BUCKERT_NAME: bucketName,
    },
    iam: {
      role: {
        statements: [
          {
            // S3の指定バケット上のオブジェクトの入出力を許可
            Effect: 'Allow',
            Action: ['s3:GetObject', 's3:PutObject'],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      CacheBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: bucketName,
        },
      },
    },
  },
  // import the function via paths
  functions: {
    app: {
      handler: 'src/index.handler',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/',
            cors: true,
          },
        },
        {
          http: {
            method: 'ANY',
            path: '/{any+}',
            cors: true,
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dotenv: {
      path: './.env',
      include: Object.keys(configedEnv.parsed),
    },
  },
};

module.exports = serverlessConfiguration;
