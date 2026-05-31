// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Rsvp: a
    .model({
      // ...フィールド定義はそのまま
      name: a.string().required(),
      furigana: a.string().required(),
      email: a.string(),
      address: a.string().required(),
      side: a.string().required(),
      attendance: a.string().required(),
      bus: a.string().required(),
      allergy: a.string(),
      specialNotes: a.string(),
      message: a.string(),
    })
    .authorization((allow) => [
      // 💡 1. 誰でも（APIキーを使って）データを作成できるように許可する
      allow.publicApiKey().to(['create']),
      // 💡 2. ログインユーザーはすべての操作が可能
      allow.authenticated(),
    ]),
});

export const data = defineData({
  schema,
  authorizationModes: {
    // 💡 認証モードに apiKey を追加する
    defaultAuthorizationMode: 'apiKey', 
    apiKeyAuthorizationMode: {
      expiresInDays: 100, // 必要に応じて調整
    },
  },
});

export type Schema = ClientSchema<typeof schema>;