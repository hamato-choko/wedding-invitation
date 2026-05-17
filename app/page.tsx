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
    specialNotes: "",
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
      console.log("送信されたデータ:", formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("送信に失敗しました。時間をおいて再度お試しください。");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-serif font-bold text-gray-800 tracking-wide">
            Wedding Invitation
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-gray-500 tracking-widest">
            ご出欠のお伺い
          </p>
        </div>

        {submitted ? (
          /* =========================================================
             【修正】送信完了後の画面（ここには情報セクションを表示しない）
             ========================================================= */
          <div className="text-center py-12 space-y-4">
            <div className="text-green-500 text-6xl animate-bounce">✓</div>
            <h3 className="text-xl font-semibold text-gray-900">
              ご回答ありがとうございました
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              新郎新婦へ情報が送信されました。<br />
              当日お会いできることを楽しみにしております。
            </p>
          </div>
        ) : (
          /* =========================================================
             送信前の画面（情報セクション ＋ 入力フォームを表示）
             ========================================================= */
          <>
            {/* 会場・日時情報セクション */}
            <div className="bg-neutral-50 rounded-xl p-5 sm:p-6 space-y-4 border border-neutral-100 text-sm text-gray-700">
              <h3 className="font-bold text-base text-gray-800 border-b border-gray-200 pb-2 font-serif">
                Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="font-semibold text-gray-500">日時 / 集合時間</span>
                <span className="sm:col-span-2 text-gray-800 font-medium">
                  2026年 X月 X日（土） <br />
                  <span className="text-indigo-600 font-semibold">【受付集合】 11:15 </span> 
                  <span className="text-gray-400">/</span> 【挙式開始】 12:00
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-dashed border-gray-200">
                <span className="font-semibold text-gray-500">式場名</span>
                <span className="sm:col-span-2 text-gray-800 font-medium">
                  ララシャンスKOBE（LaLa Chance KOBE）<br />
                  <a 
                    href="https://www.ikk-wed.jp/kobe/access" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-indigo-600 underline hover:text-indigo-800 inline-block mt-1"
                  >
                    公式アクセスサイトを見る ↗
                  </a>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-dashed border-gray-200">
                <span className="font-semibold text-gray-500">住所</span>
                <span className="sm:col-span-2 text-gray-600">
                  〒650-0045 兵庫県神戸市中央区港島波止場2
                </span>
              </div>
              
              {/* Googleマップ埋め込み */}
              <div className="w-full overflow-hidden rounded-lg border border-gray-200 aspect-video mt-3">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.5634455047357!2d135.2023265!3d34.6657264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60008fa30bb1cc2f%3A0x5158554b8b78d2a!2z44Op44Op44K344Oj44Oz44K5S09CRe-8iOelnuaIuOW4giDntZDlqZrlvI_loLTvvIk!5e0!3m2!1sja!2sjp!4v1779037088985!5m2!1sja!2sjp" 
                  className="w-full h-full border-0"
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* 送迎バス情報セクション */}
            <div className="bg-neutral-50 rounded-xl p-5 sm:p-6 space-y-3 border border-neutral-100 text-sm text-gray-700">
              <h3 className="font-bold text-base text-gray-800 border-b border-gray-200 pb-2 font-serif">
                Shuttle Bus Information
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                当日は三ノ宮駅より、専用の無料送迎バスが運行しております。運行スケジュールは以下の画像をご確認ください。
              </p>
              <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white">
                <img 
                  src="https://www.ikk-wed.jp/files/uploads/%E7%94%BB%E5%83%8F%20(10)_1.png" 
                  alt="三ノ宮駅送迎バス時刻表・乗り場案内" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* 入力フォーム */}
            <form className="space-y-6 pt-4 border-t border-gray-100" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700 rounded-r-md">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                {/* お名前 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    お名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="山田 太郎"
                  />
                </div>

                {/* フリガナ */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    フリガナ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="furigana"
                    required
                    value={formData.furigana}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="ヤマダ タロウ"
                  />
                </div>

                {/* メールアドレス */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="example@email.com"
                  />
                </div>

                {/* 新郎/新婦の招待選択 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    どちらからのご招待ですか？ <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 flex items-center space-x-6 text-sm">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="side"
                        value="groom"
                        checked={formData.side === "groom"}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">新郎側</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="side"
                        value="bride"
                        checked={formData.side === "bride"}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">新婦側</span>
                    </label>
                  </div>
                </div>

                {/* 参加可否 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    結婚式の出欠 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 flex items-center space-x-6 text-sm">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value="yes"
                        checked={formData.attendance === "yes"}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700 font-medium">ご出席</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="attendance"
                        value="no"
                        checked={formData.attendance === "no"}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-gray-700">ご欠席</span>
                    </label>
                  </div>
                </div>

                {/* 送迎バス */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    送迎バスの利用
                  </label>
                  <select
                    name="bus"
                    value={formData.bus}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="no">不要（自家用車・公共交通機関など）</option>
                    <option value="yes">必要（三ノ宮駅からのシャトルバスを利用）</option>
                  </select>
                </div>

                {/* アレルギー (凡例の追加) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    アレルギー・苦手な食べ物について
                  </label>
                  <div className="mt-1 bg-amber-50 rounded p-3 text-xs text-amber-800 space-y-1 border border-amber-100">
                    <p className="font-semibold">【ご記入の凡例】</p>
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li>アレルギー： エビ・カニ（出汁もNG）、小麦アレルギー 等</li>
                      <li>苦手な食べ物： 生魚が苦手（火が通っていればOK）、加熱した椎茸 等</li>
                    </ul>
                    <p className="text-[11px] text-amber-700 pt-1">※重度のアレルギー等、調理器具の洗浄レベルから配慮が必要な場合はその旨もご記載ください。</p>
                  </div>
                  <textarea
                    name="allergy"
                    value={formData.allergy}
                    onChange={handleChange}
                    rows={2}
                    className="mt-2 block w-full shadow-sm text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="特にありません / 凡例を参考に具体的にご記入ください"
                  />
                </div>

                {/* 特記事項 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    特記事項・ご要望
                  </label>
                  <p className="text-xs text-gray-400 mb-1">
                    车椅子でのご来場、妊娠中、授乳中、お子様連れでのご参加など、配慮が必要な点がございましたらご自由にご記入ください。
                  </p>
                  <textarea
                    name="specialNotes"
                    value={formData.specialNotes}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 block w-full shadow-sm text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="例：車椅子を利用しているため、スロープの配置を希望します。 / 授乳室の利用を希望します。"
                  />
                </div>

                {/* メッセージ */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    新郎新婦へのメッセージ
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full shadow-sm text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="おめでとうございます！当日を楽しみにしています。"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
                >
                  入力内容を送信する
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}