// app/RsvpForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
// AmplifyのAPIクライアントをインポート
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

// クライアントの初期化
const client = generateClient<Schema>();

export default function RsvpForm() {
  // --- 1. ここに判定用のStateを追加 ---
  const [isLineBrowser, setIsLineBrowser] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    furigana: "",
    email: "",
    address: "",
    side: "groom",
    attendance: "yes",
    bus: "no",
    allergy: "",
    specialNotes: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 2. ページ読み込み時にLINEブラウザかどうかを判定 ---
  // 注意: useEffect は import { useEffect } from "react"; が必要です
  // ファイル上部の import 文に追加してください

// LINEブラウザ判定処理
  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    setIsLineBrowser(ua.includes("line"));
  }, []);

  // 判定がまだ終わっていない場合は何も表示しない（ちらつき防止）
  if (isLineBrowser === null) return null;

// LINEブラウザだった場合、画面全体をブロックして誘導を表示
  if (isLineBrowser) {
    return (
      <div className="fixed inset-0 bg-red-950 z-[9999] flex flex-col items-center justify-center p-6 text-stone-100">
        <div className="text-center space-y-6 max-w-sm">
          <div className="text-amber-200 text-4xl">🙇‍♂️🙇‍♀️</div>
          <h2 className="text-2xl font-serif font-bold">ブラウザの切り替えが必要です</h2>
          <p className="text-sm leading-relaxed text-stone-300">
            現在LINEアプリ内のブラウザで開かれています。<br />
            このままでは出席登録が正常に行えません。<br /><br />
            お手数ですが、画面右上の「…」またはブラウザアイコンをタップし、<br />
            <span className="text-amber-200 font-bold">「Safariで開く」または「ブラウザで開く」</span><br />
            を選択してください。
          </p>
        </div>
      </div>
    );
  }

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
        address: formData.address,
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
        
        {/* メインビジュアル画像（これは送信前後どちらでも世界観を保つために残しています） */}
        <div className="w-full h-auto overflow-hidden bg-red-950/50">
          <img 
            src="/images/wedding_invitation.jpg" 
            alt="Wedding Invitation Main Visual" 
            className="w-full h-auto block"
          />
        </div>

        <div className="p-6 sm:p-10 space-y-10">

          {/* 💡 送信完了画面の切り替え処理 */}
          {submitted ? (
            // 【送信完了後に表示されるシンプルな画面】
            <div className="text-center py-16 space-y-6">
              <div className="text-amber-200 text-6xl animate-bounce">✓</div>
              <h3 className="text-xl font-serif font-bold text-amber-100 tracking-wide">
                ご回答ありがとうございました。
              </h3>
              <div className="text-sm sm:text-base text-stone-300 max-w-md mx-auto leading-relaxed space-y-2 font-serif">
                <p>ご出欠の回答を無事に受け付けました。</p>
                <p>おいそがしい中ご回答いただき<br />誠にありがとうございました</p>
              </div>
            </div>
          ) : (
            // 【送信前に表示される通常の画面（タイトル・写真・挨拶・自己紹介・フォーム）】
            <>

              <div className="w-full px-2 sm:px-4">
                <div className="w-full h-auto overflow-hidden rounded-xl border border-red-900/40 shadow-xl bg-red-900/20 p-1.5 sm:p-2">
                  <img 
                    src="/images/futari.jpg" 
                    alt="新郎新婦 お写真" 
                    className="w-full h-auto block rounded-lg"
                  />
                </div>
              </div>

              {/* Message セクション */}
              <div className="text-center space-y-4 py-6 border-y border-red-900/60">
                <h3 className="text-2xl font-serif italic text-amber-200 tracking-wider">
                  Message
                </h3>
                <div className="text-sm sm:text-base text-stone-200 leading-loose tracking-widest space-y-6 font-serif">
                  <p className="font-bold">謹啓</p>
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
              <p className="font-bold">謹白</p>
                </div>
              </div>

              {/* 新郎新婦 紹介セクション */}
              <div className="space-y-12 bg-black/15 p-6 sm:p-8 rounded-xl border border-red-900/40">
                <h3 className="text-center text-xl font-serif font-bold text-amber-100 tracking-wide">
                  Groom & Bride
                </h3>
                
                <div className="space-y-16 pt-2">
                  {/* 新郎 */}
                  <div className="space-y-5">
                    <div className="w-full max-w-[280px] aspect-[1/1] mx-auto rounded-xl overflow-hidden border border-red-900/60 shadow-md bg-red-900/30">
                      <img src="/images/ryosuke.jpg" alt="新郎 亮佑" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center pb-1 max-w-[280px] mx-auto border-b border-red-900/60">
                      <span className="text-[10px] tracking-widest text-stone-400 block font-serif leading-none">GROOM</span>
                      <span className="text-lg font-bold text-white font-serif">濵戸 亮佑</span>
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

                  {/* 新婦 */}
                  <div className="space-y-5">
                    <div className="w-full max-w-[280px] aspect-[1/1] mx-auto rounded-xl overflow-hidden border border-red-900/60 shadow-md bg-red-900/30">
                      <img src="/images/erika.jpg" alt="新婦 恵利佳" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center pb-1 max-w-[280px] mx-auto border-b border-red-900/60">
                      <span className="text-[10px] tracking-widest text-stone-400 block font-serif leading-none">BRIDE</span>
                      <span className="text-lg font-bold text-white font-serif">桂木 恵利佳</span>
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

              {/* 会場・日時情報セクション */}
              <div className="bg-black/15 rounded-xl p-5 sm:p-6 space-y-4 border border-red-900/40 text-sm text-stone-300">
                <h3 className="font-bold text-base text-amber-100 border-b border-red-900/60 pb-2 font-serif tracking-wider">Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span className="font-semibold text-stone-400">日時 / 集合時間</span>
                  <span className="sm:col-span-2 text-white font-medium">
                    2026年 8月 8日（土） <br />
                    <span className="text-amber-200 font-bold">【受付】 13:00 / 【挙式】 14:00 / 【披露宴】 15:00</span>
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
                  <span className="sm:col-span-2 text-stone-300">〒650-0045 兵庫県神戸市中央区港島1-116</span>
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
              <div className="pt-8 pb-4 mb-0 text-center">
                <h3 className="text-xl font-serif font-bold text-amber-100 tracking-wide">
                  出席情報のご登録
                </h3>
                <p className="text-sm text-stone-200 leading-relaxed font-serif pt-8">
                  お手数ではございますが、
                  出席情報のご登録をお願い申し上げます。<br />
                  <span className="text-amber-200 font-bold">回答期限：6月27日</span>
                </p>
              </div>
              <form className="space-y-6 pt-4 border-t border-red-900/60" onSubmit={handleSubmit}>
                {error && <div className="bg-red-900/50 border-l-4 border-amber-200 p-4 text-sm text-stone-100 rounded-r-md">{error}</div>}

                <div className="space-y-5">
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
                    <label className="block text-sm font-semibold text-stone-200">ご住所 <span className="text-amber-300">*</span></label>
                    <input 
                      type="text" 
                      name="address" 
                      required 
                      value={formData.address} 
                      onChange={handleChange} 
                      className="mt-1 block w-full px-3 py-2 bg-red-950/60 border border-red-900/80 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-200 focus:border-amber-200" 
                      placeholder="兵庫県神戸市..." 
                    />
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
                        <li>苦手な食べ物： 生魚が苦手（火が通っていればOK） 等</li>
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