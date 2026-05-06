"use client";

import { useState } from "react";

export default function RsvpPage() {
  const [formData, setFormData] = useState({
    name: "",
    furigana: "",
    email: "",
    side: "groom",
    attendance: "yes",
    bus: "no",
    allergy: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Amplify Gen 2 のデータストア等へ接続する処理はここに実装します
      // 例: await client.models.Attendance.create(formData);
      
      console.log("送信されたデータ:", formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("送信に失敗しました。時間をおいて再度お試しください。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Wedding Invitation
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ご出欠のお伺い
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-10">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ご回答ありがとうございました
            </h3>
            <p className="text-sm text-gray-600">
              新郎新婦へ情報が送信されました。当日お会いできることを楽しみにしております。
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="rounded-md shadow-sm space-y-4">
              {/* お名前 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="山田 太郎"
                />
              </div>

              {/* フリガナ */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  フリガナ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="furigana"
                  required
                  value={formData.furigana}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ヤマダ タロウ"
                />
              </div>

              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="example@email.com"
                />
              </div>

              {/* 新郎/新婦の招待選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  どちらからのご招待ですか？ <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 space-y-2">
                  <label className="inline-flex items-center mr-6">
                    <input
                      type="radio"
                      name="side"
                      value="groom"
                      checked={formData.side === "groom"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-2">新郎側</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="side"
                      value="bride"
                      checked={formData.side === "bride"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-2">新婦側</span>
                  </label>
                </div>
              </div>

              {/* 参加可否 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  結婚式の出欠 <span className="text-red-500">*</span>
                </label>
                <div className="mt-2 space-y-2">
                  <label className="inline-flex items-center mr-6">
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={formData.attendance === "yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-2">ご出席</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={formData.attendance === "no"}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-2">ご欠席</span>
                  </label>
                </div>
              </div>

              {/* 送迎バス */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  送迎バスの利用
                </label>
                <select
                  name="bus"
                  value={formData.bus}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="no">不要</option>
                  <option value="yes">必要</option>
                </select>
              </div>

              {/* アレルギー */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  アレルギーについて
                </label>
                <textarea
                  name="allergy"
                  value={formData.allergy}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="特にありません / エビ・カニ等"
                />
              </div>

              {/* メッセージ */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  新郎新婦へのメッセージ
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="おめでとうございます！当日を楽しみにしています。"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                入力内容を送信する
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}