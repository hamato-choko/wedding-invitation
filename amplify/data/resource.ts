// app/RsvpForm.tsx
"use client";

import { useState } from "react";
// === AmplifyのAPIクライアントをインポート ===
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

// クライアントの初期化
const client = generateClient<Schema>();

export default function RsvpForm() {
  const [formData, setFormData] = useState({
    name: "",
    furigana: "",
    email: "",
    side: "groom",
    attendance: "yes",
    bus: "no",
    allergy: "",
    specialNotes: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 送信中のローディング状態

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // === 送信処理をDynamoDB連携に書き換え ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // client.models.Rsvp.create を呼ぶだけで、自動的にDynamoDBに保存されます
      const { errors, data } = await client.models.Rsvp.create({
        name: formData.name,
        furigana: formData.furigana,
        email: formData.email || undefined, // 空文字の場合はundefined（保存しない）にする
        side: formData.side,
        attendance: formData.attendance,
        bus: formData.bus,
        allergy: formData.allergy || undefined,
        specialNotes: formData.specialNotes || undefined,
        message: formData.message || undefined,
      });

      if (errors) {
        console.error("GraphQLのエラー:", errors);
        throw new Error("データの保存に失敗しました");
      }

      console.log("DynamoDBに保存されたデータ:", data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("送信に失敗しました。電波の良い場所で再度お試しいただくか、新郎新婦へ直接ご連絡ください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-red-950 rounded-2xl shadow-2xl border border-red-900/50 overflow-hidden text-stone-100">
        
        {/* （中略：メイン画像、メッセージ、プロフィール、インフォメーション等は変更なし） */}
        {/* スペース省略のため、下部のフォーム送信ボタンの部分までスクロールします */}

                {/* ボタンの見た目を「送信中」の状態に対応させる */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-red-950 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-200 shadow-md transition-colors tracking-widest font-bold ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "送信中..." : "入力内容を送信する"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}