// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';

/**
 * 新郎新婦おふたりが管理画面にログインするための認証設定
 * ログイン方式：ユーザー名
 * パスワードルール：7文字以上（大文字・記号などの制限なし）
 */
export const auth = defineAuth({
  loginWith: {
    // 💡 email: true を削除（またはコメントアウト）し、代わりに以下を設定します
    email: true, 
  },
  userAttributes: {
    // 💡 ユーザー名ログインの場合でも、アカウント作成やパスワード復旧用にEメールだけは裏で取得するようにします
    email: {
      required: true,
      mutable: true,
    }
  },
  // 🔒 パスワードのセキュリティルールを極限まで緩める設定
  passwordPolicy: {
    minLength: 8,                  // 💡 7文字以上
    requireLowercase: false,       // 小文字は必須にしない
    requireUppercase: false,       // 大文字は必須にしない
    requireDigits: false,          // 数字は必須にしない
    requireSymbols: false,         // 記号は必須にしない
  },
});