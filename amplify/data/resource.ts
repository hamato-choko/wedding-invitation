// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// 1. 招待状用のデータモデル（DynamoDBのテーブル構造）を定義
const schema = a.schema({
  Rsvp: a
    .model({
      name: a.string().required(),         // お名前（必須）
      furigana: a.string().required(),     // フリガナ（必須）
      email: a.string(),                   // メールアドレス
      side: a.string().required(),         // 新郎側(groom) / 新婦側(bride)（必須）
      attendance: a.string().required(),   // ご出席(yes) / ご欠席(no)（必須）
      bus: a.string().required(),          // 送迎バス 必要(yes) / 不要(no)（必須）
      allergy: a.string(),                 // アレルギー・苦手な食べ物
      specialNotes: a.string(),            // 特記事項・ご要望
      message: a.string(),                 // 新郎新婦へのメッセージ
    })
    // ログインしていないゲストでもフォームの送信（作成）だけできるように許可
    .authorization((allow) => [allow.publicApiKey().to(["create"])]),
});

export type Schema = ClientSchema<typeof schema>;

// 2. Amplifyのデータサービスを設定
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30, // 30日間有効なAPIキー（本番時は延ばせます）
    },
  },
});