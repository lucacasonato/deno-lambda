// Note: You must have local DynamoDB running in order to run these tests:
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html

// You must also pass a access key/secret environment variables, but these don't have to be real e.g.
// AWS_ACCESS_KEY_ID=fakeMyKeyId AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey deno --allow-env --allow-net test.ts

import { runIfMain } from "https://deno.land/std@v0.27.0/testing/mod.ts";
import {
  assert,
  assertEquals
} from "https://deno.land/std@v0.27.0/testing/asserts.ts";

import { client } from "./client.ts";
import { test } from "./test_util.ts";
import {
  list as listCandidate,
  get as getCandidate,
  submit as submitCandidate,
  TableName
} from "./api/candidate.ts";

test({
  name: "test setup",
  fn: async () => {
    const result = await client.getItem({
      TableName,
      Key: { id: "abc" }
    });
    const user = result.Item;
    assertEquals(user.role, "admin");
  }
});

test({
  name: "test list",
  fn: async () => {
    const result = await listCandidate({}, {});
    assertEquals(result.statusCode, 200);
    const body = JSON.parse(result.body);
    assertEquals(body.candidates.length, 2);
  }
});

test({
  name: "test get",
  fn: async () => {
    const result = await getCandidate({ pathParameters: { id: "abc" } }, {});
    assertEquals(result.statusCode, 200);
    const body = JSON.parse(result.body);
    assertEquals(body.id, "abc");
    assertEquals(body.role, "admin");
  }
});

test({
  name: "test get missing",
  fn: async () => {
    const result = await getCandidate({ pathParameters: { id: "bad" } }, {});
    assertEquals(result.statusCode, 404);
    const body = JSON.parse(result.body);
    assertEquals(body.message, "Not Found: bad");
  }
});

test({
  name: "test submit",
  fn: async () => {
    const event = {
      body:
        '{"fullname":"Shekhar Gulati","email": "shekhargulati84@gmail.com", "experience":12}'
    };
    const result = await submitCandidate(event, {});
    assertEquals(result.statusCode, 200);
    const body = JSON.parse(result.body);
    assertEquals(
      body.message,
      "Sucessfully submitted candidate with email shekhargulati84@gmail.com"
    );
  }
});

test({
  name: "test submit empty",
  fn: async () => {
    const event = { body: "{}" };
    const result = await submitCandidate(event, {});
    assertEquals(result.statusCode, 422);
    const body = JSON.parse(result.body);
    assertEquals(body.message, "invalid input");
  }
});

runIfMain(import.meta);
