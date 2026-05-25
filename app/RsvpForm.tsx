// app/RsvpForm.tsx
"use client";

import { useState } from "react";
import { Amplify } from "aws-amplify";
// AmplifyのAPIクライアントをインポート
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

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
    
    // 状態(formData)を更新するときは、直前の最新状態(prev)を確実に引き継ぐようにします
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  // 送信処理をDynamoDB連携に書き換え
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // client.models.Rsvp.create で自動的にDynamoDBに保存されます
      const { errors, data } = await client.models.Rsvp.create({
        name: formData.name,
        furigana: formData.furigana,
        email: formData.email || undefined,
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
    <div className="min-h-screen bg-stone-100 flex items-center justify-center py-0 sm:py-8 px-0 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-red-950 rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border border-red-900/50 overflow-hidden text-stone-100">
        
        {/* 1. メインビジュアル画像 */}
        <div className="w-full h-auto overflow-hidden bg-red-950/50">
          <img 
            src="/images/wedding_invitation.jpg" 
            alt="Wedding Invitation Main Visual" 
            className="w-full h-auto block"
          />
        </div>

        <div className="p-6 sm:p-10 space-y-10">

          {/* 💡 注目ポイント：ここに新郎新婦の2人写真をベスト配置！ */}
          <div className="w-full px-2 sm:px-4">
            <div className="w-full h-auto overflow-hidden rounded-xl border border-red-900/40 shadow-xl bg-red-900/20 p-1.5 sm:p-2">
              <img 
                src="/images/futari.jpg" 
                alt="新郎新婦 お写真" 
                className="w-full h-auto block rounded-lg"
              />
            </div>
          </div>

          {/* 2. Message セクション */}
          <div className="text-center space-y-4 py-6 border-y border-red-900/60">
            <h3 className="text-2xl font-serif italic text-amber-200 tracking-wider">
              Message
            </h3>
            <div className="text-sm sm:text-base text-stone-200 leading-loose tracking-widest space-y-6 font-serif">
              <p>皆様いかがお過ごしでしょうか</p>
              <p>このたび 結婚式を<br />執り行うこととなりました</p>
              
              <p>日頃お世話になっております<br />
              みなさまに 私どもの門出を<br />
              お見守りいただきたく<br />
              ささやかながら小宴を<br />
              催したく存じます</p>

              <p>ご多用中 誠に恐縮ではございますが<br />
              ぜひご出席いただきたく<br />
              ご案内申し上げます</p>
            </div>
          </div>

          {/* 3. 新郎新婦 紹介セクション */}
          <div className="space-y-12 bg-black/15 p-6 sm:p-8 rounded-xl border border-red-900/40">
            <h3 className="text-center text-xl font-serif font-bold text-amber-100 tracking-wide">
              Groom & Bride
            </h3>
            
            <div className="space-y-16 pt-2">
              {/* === 新郎セクション === */}
              <div className="space-y-5">
                <div className="w-full max-w-[280px] aspect-[1/1] mx-auto rounded-xl overflow-hidden border border-red-900/60 shadow-md bg-red-900/30">
                  <img src="/images/ryosuke.jpg" alt="新郎 亮佑" className="w-full h-full object-cover" />
                </div>
                <div className="text-center pb-1 max-w-[280px] mx-auto border-b border-red-900/60">
                  <span className="text-[10px] tracking-widest text-stone-400 block font-serif leading-none">GROOM</span>
                  <span className="text-lg font-bold text-white font-serif">亮佑</span>
                </div>
                <div className="space-y-4 text-left max-w-[280px] mx-auto text-xs">
                  <div className="space-y-1">
                    <div className="inline-block px-2.5 py-0.5 bg-amber-100/15 text-[10px] text-amber-200 font-bold rounded-md tracking-wider border border-amber-100/10">生年月日</div>
                    <p className="text-stone-200 font-medium pl-1 text-sm">1996年 11月 12日</p>
                  </div>
                  <div className="space-y-1">
                    <div className="inline-block px-2.5 py-0.5 bg-amber-100/15 text-[10px] text-amber-200 font-bold rounded-md tracking-wider border border-amber-100/10">血液型</div>
                    <p className="text-stone-200 font-medium pl-1 text-sm">A型</p>
                  </div>
                  <div className="space-y-1">
                    <div className="inline-block px-2.5 py-0.5 bg-amber-100/15 text-[10px] text-amber-200 font-bold rounded-md tracking-wider border border-amber-100/10">趣味</div>
                    <p className="text-stone-200 font-medium pl-1 text-sm">楽器演奏・スポーツ観戦</p>
                  </div>
                  <div className="space-y-1">
                    <div className="inline-block px-2.5 py-0.5 bg-amber-100/15 text-[10px] text-amber-200 font-bold rounded-md tracking-wider border border-amber-100/10">好きな食べ物</div>
                    <p className="text-stone-200 font-medium pl-1 text-sm">うどん・ビーフシチュー</p>
                  </div>
                </div>
              </div>

              {/* === 新婦セクション === */}
              <div className="space-y-5">
                <div className="w-full max-w-[280px] aspect-[1/1] mx-auto rounded-xl overflow-hidden border border-red-900/60 shadow-md bg-red-900/30">
                  <img src="/images/erika.jpg" alt="新婦 恵利佳" className="w-full h-full object-cover" />
                </div>
                <div className="text-center pb-1 max-w-[280px] mx-auto border-b border-red-900/60">
                  <span className="text-[10px] tracking-widest text-stone-400 block font-serif leading-none">BRIDE</span>
                  <span className="text-lg font-bold text-white font-serif">恵利佳</span>
                </div>
                <div className="space-y-4 text-left max-w-[280px] mx-auto text-xs">
                  <div className="space-y-1">
                    <div className="inline-block px-2.5 py-0.5 bg-amber-100/15 text-[10px] text-amber-200 font-bold rounded-md tracking-wider border border-amber-100/10">生年月日</div>
                    <p className="text-stone-200 font-medium pl-1 text-sm">2000年 3月 25日</p>
                  </div>
                  <div className="space-y-1">
                    <div className="inline-block px-2.5 py-0.5 bg-amber-100/15 text-[10px] text-amber-200 font-bold rounded-md tracking-wider border border-amber-100/10">血液型</div>
                    <p className="text-stone-200 font-medium pl-1 text-sm">B型</p>
                  </div>
                  <div className="space-y-1">
                    <div className="inline-block px-2.5 py-0.5 bg-amber-100/15 text-[10px] text-amber-200 font-bold rounded-md tracking-wider border border-amber-100/10">趣味</div>
                    <p className="text-stone-200 font-medium pl-1 text-sm">楽器演奏・料理</p>
                  </div>
                  <div className="space-y-1">
                    <div className="inline-block px-2.5 py-0.5 bg-amber-100/15 text-[10px] text-amber-200 font-bold rounded-md tracking-wider border border-amber-100/10">好きな食べ物</div>
                    <p className="text-stone-200 font-medium pl-1 text-sm">ラーメン・パン</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="text-amber-200 text-6xl animate-bounce">✓</div>
              <h3 className="text-xl font-semibold text-white">ご回答ありがとうございました</h3>
              <p className="text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                新郎新婦へ情報が送信されました。<br />当日お会いできることを楽しみにしております。
              </p>
            </div>
          ) : (
            <>
              {/* 会場・日時情報セクション */}
              <div className="bg-black/15 rounded-xl p-5 sm:p-6 space-y-4 border border-red-900/40 text-sm text-stone-300">
                <h3 className="font-bold text-base text-amber-100 border-b border-red-900/60 pb-2 font-serif tracking-wider">Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span className="font-semibold text-stone-400">日時 / 集合時間</span>
                  <span className="sm:col-span-2 text-white font-medium">
                    2026年 8月 8日（土） <br />
                    <span className="text-amber-200 font-bold">【受付開始】 13:00 </span> / 【挙式開始】 14:00
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-dashed border-red-900/40">
                  <span className="font-semibold text-stone-400">式場名</span>
                  <span className="sm:col-span-2 text-white font-medium">
                    ララシャンスKOBE（LaLa Chance KOBE）<br />
                    <a href="https://www.ikk-wed.jp/kobe/access" target="_blank" rel="noopener noreferrer" className="text-xs text-amber-200 font-semibold underline hover:text-amber-100 inline-block mt-1">公式アクセスサイトを見る ↗</a>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-dashed border-red-900/40">
                  <span className="font-semibold text-stone-400">住所</span>
                  <span className="sm:col-span-2 text-stone-300">〒650-0045 兵庫県神戸市中央区港島波止場2</span>
                </div>
                <div className="w-full overflow-hidden rounded-lg border border-red-900/60 aspect-video mt-3 opacity-90">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.5634455047357!2d135.2023265!3d34.6657264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60008fa30bb1cc2f%3A0x5158554b8b78d2a!2z44Op44Op44K344Oj44Oz44K5S09CRe-8iOelnuaIuOW4giDntZDlqZrlvI_loLTvvIk!5e0!3m2!1sja!2sjp!4v1779037088985!5m2!1sja!2sjp" className="w-full h-full border-0" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>

              {/* 送迎バス情報セクション */}
              <div className="bg-black/15 rounded-xl p-5 sm:p-6 space-y-3 border border-red-900/40 text-sm text-stone-300">
                <h3 className="font-bold text-base text-amber-100 border-b border-red-900/60 pb-2 font-serif tracking-wider">
                  Shuttle Bus Information
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  当日は三ノ宮駅より、専用の無料送迎バスが運行しております。運行スケジュールは以下の画像をご確認ください。
                </p>
                <div className="w-full rounded-lg overflow-hidden border border-red-900/60 bg-white/5 p-1">
                  <img 
                    src="/images/map.webp" 
                    alt="三ノ宮駅送迎バス時刻表・乗り場案内" 
                    className="w-full h-auto object-contain rounded"
                  />
                </div>
              </div>

              {/* 入力フォーム */}
              <form className="space-y-6 pt-4 border-t border-red-900/60" onSubmit={handleSubmit}>
                {error && <div className="bg-red-900/50 border-l-4 border-amber-200 p-4 text-sm text-stone-100 rounded-r-md">{error}</div>}

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-200">お名前 <span className="text-amber-300">*</span></label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-red-950/60 border border-red-900/80 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-200 focus:border-amber-200" placeholder="山田 太郎" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-200">フリガナ <span className="text-amber-300">*</span></label>
                    <input type="text" name="furigana" required value={formData.furigana} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-red-950/60 border border-red-900/80 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-200 focus:border-amber-200" placeholder="ヤマダ タロウ" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-200">メールアドレス</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-red-950/60 border border-red-900/80 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-200 focus:border-amber-200" placeholder="example@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-200">どちらからのご招待ですか？ <span className="text-amber-300">*</span></label>
                    <div className="mt-2 flex items-center space-x-6 text-sm">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="radio" name="side" value="groom" checked={formData.side === "groom"} onChange={handleChange} className="h-4 w-4 accent-amber-200" />
                        <span className="ml-2 text-stone-300">新郎側</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="radio" name="side" value="bride" checked={formData.side === "bride"} onChange={handleChange} className="h-4 w-4 accent-amber-200" />
                        <span className="ml-2 text-stone-300">新婦側</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-200">結婚式の出欠 <span className="text-amber-300">*</span></label>
                    <div className="mt-2 flex items-center space-x-6 text-sm">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="radio" name="attendance" value="yes" checked={formData.attendance === "yes"} onChange={handleChange} className="h-4 w-4 accent-amber-200" />
                        <span className="ml-2 text-white font-semibold">ご出席</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="radio" name="attendance" value="no" checked={formData.attendance === "no"} onChange={handleChange} className="h-4 w-4 accent-amber-200" />
                        <span className="ml-2 text-stone-300">ご欠席</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-200">送迎バスの利用</label>
                    <select name="bus" value={formData.bus} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-red-900/80 bg-red-950/80 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-200">
                      <option value="no" className="bg-red-950 text-white">不要（自家用車・公共交通機関など）</option>
                      <option value="yes" className="bg-red-950 text-white">必要（三ノ宮駅からのシャトルバスを利用）</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-200">アレルギー・苦手な食べ物について</label>
                    <div className="mt-1 bg-black/20 rounded p-3 text-xs text-stone-300 space-y-1 border border-red-900/40">
                      <p className="font-semibold text-amber-200">【ご記入の凡例】</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-stone-400">
                        <li>アレルギー： エビ・カニ（出汁もNG）、小麦アレルギー 等</li>
                        <li>苦手な食べ物： 生魚が苦手（火が通っていればOK）、加熱した椎茸 等</li>
                      </ul>
                      <p className="text-[11px] text-stone-500 pt-1">※重度のアレルギー等, 調理器具の洗浄レベルから配慮が必要な場合はその旨もご記載ください。</p>
                    </div>
                    <textarea name="allergy" value={formData.allergy} onChange={handleChange} rows={2} className="mt-2 block w-full text-sm bg-red-950/60 border border-red-900/80 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-amber-200" placeholder="特にありません / 凡例を参考に具体的にご記入ください" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-200">特記事項・ご要望</label>
                    <p className="text-xs text-stone-400 mb-1">
                      車椅子でのご来場、妊娠中、授乳中、お子様連れでのご参加など、配慮が必要な点がございましたらご自由記入ください。
                    </p>
                    <textarea name="specialNotes" value={formData.specialNotes} onChange={handleChange} rows={2} className="mt-1 block w-full text-sm bg-red-950/60 border border-red-900/80 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-amber-200" placeholder="例：車椅子を利用しているため、スロープの配置を希望します。 / 授乳室の利用を希望します。" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-200">新郎新婦へのメッセージ</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={3} className="mt-1 block w-full text-sm bg-red-950/60 border border-red-900/80 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-amber-200" placeholder="おめでとうございます！当日を楽しみにしています。" />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-red-950 bg-amber-100 hover:bg-amber-200 font-bold ${
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