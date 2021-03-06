# Serverless example

Deploy in a single step using [`serverless deploy`](https://serverless.com/framework/docs/providers/aws/guide/deploying/).

This example lambda application defines:

- A lambda layer from the `deno-lambda-layer.zip`.
- A DynamodDB table "candidates".
- Three lambda functions a list/get/submit.
- An API Gateway endpoint to these functions.

Requires `deno-lambda-layer.zip` to be in the directory:

    curl -sfL https://github.com/hayd/deno-lambda/releases/download/v0.4.0/deno-lambda-layer.zip -o deno-lambda-layer.zip

This example is based on [_Building a REST API in Node.js with AWS Lambda, API Gateway, DynamoDB, and Serverless Framework_ blogpost by Shekhar Gulat](https://serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb/).

See the application described in `serverless.yml` and the exported functions in `api/candidate.ts`.

Note: The `serverless-scriptable-plugin` is used to compile `api/candidate.ts` so there is no init-time download/compilation step.

---

TODO:

- [ ] Should layer be a distinct template/directory? Each full deploy pushes a new version of the layer, ideally this shouldn't be the case.
      https://serverless.com/blog/publish-aws-lambda-layers-serverless-framework/ ?
- [ ] Tests are included, require local-dynamodb to be running. Should be part of CI.
