// app/admin/AdminForm.tsx
"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

const client = generateClient<Schema>();

export default function AdminForm() {
  const [rsvps, setRsvps] = useState<Array<Schema["Rsvp"]["type"]>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [editingRsvp, setEditingRsvp] = useState<Schema["Rsvp"]["type"] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 💡 これが消えていたためエラーになっていました

  const [newRsvp, setNewRsvp] = useState({
    name: "",
    furigana: "",
    attendance: "yes",
    side: "groom",
    bus: "no",
    allergy: "",
    message: ""
  });

  useEffect(() => {
    // コンポーネント起動時にAmplifyを初期化
    Amplify.configure(outputs);

    const fetchRsvps = async () => {
      try {
        setLoading(true);
        const response = await client.models.Rsvp.list();
        
        // 💡 念のため、データが本当に取れているかブラウザの「F12」ログに出力
        console.log("経由：AWSから取得した生データ:", response.data);

        if (response.data) {
          // フリガナ順に正しくソート
          const sorted = [...response.data].sort((a, b) => 
            (a.furigana || "").localeCompare(b.furigana || "", "ja")
          );
          
          // 💡 ここでステートを更新！これでNext.jsが「データが入ったぞ！」と気づいて画面を再描画します
          setRsvps(sorted);
        }
      } catch (err) {
        console.error("🔥データ取得エラーの詳細:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRsvps();
  }, []); // 最初の1回だけ実行

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRsvp.name || !newRsvp.furigana) {
      alert("名前とフリガナは必須です");
      return;
    }
    try {
      await client.models.Rsvp.create({
        name: newRsvp.name,
        furigana: newRsvp.furigana,
        attendance: newRsvp.attendance,
        side: newRsvp.side,
        bus: newRsvp.bus,
        allergy: newRsvp.allergy || undefined,
        message: newRsvp.message || undefined,
      });
      setIsAddModalOpen(false);
      setNewRsvp({ name: "", furigana: "", attendance: "yes", side: "groom", bus: "no", allergy: "", message: "" });
      alert("データを手動追加しました。再読み込みすると反映されます。");
      window.location.reload(); // 💡 画面を自動でリロードしてデータを再取得
    } catch (err) {
      alert("追加に失敗しました");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRsvp) return;
    try {
      await client.models.Rsvp.update({
        id: editingRsvp.id,
        name: editingRsvp.name,
        furigana: editingRsvp.furigana,
        attendance: editingRsvp.attendance,
        side: editingRsvp.side,
        bus: editingRsvp.bus,
        allergy: editingRsvp.allergy,
        message: editingRsvp.message,
      });
      setIsEditModalOpen(false);
      alert("更新を保存しました。");
      window.location.reload(); // 💡 画面を自動でリロード
    } catch (err) {
      alert("更新に失敗しました");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このゲストの回答データを完全に削除してもよろしいですか？")) return;
    try {
      await client.models.Rsvp.delete({ id });
      alert("削除しました。");
      window.location.reload(); // 💡 画面を自動でリロード
    } catch (err) {
      alert("削除に失敗しました");
    }
  };

  const filteredRsvps = rsvps.filter(r => 
    r.name.includes(searchTerm) || r.furigana.includes(searchTerm)
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">ゲストデータを読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">RSVP 管理ダッシュボード</h1>
            <p className="text-sm text-gray-500">最新のご出欠回答データを一覧・編集できます（ローカル安定版）</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input 
              type="text" 
              placeholder="お名前・フリガナで検索..." 
              className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors"
            >
              ＋ 手動でゲストを追加
            </button>
          </div>
        </div>

        {/* 統計ミニダッシュボード */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">合計回答</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{rsvps.length} <span className="text-xs font-normal text-gray-500">名</span></p>
          </div>
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-center shadow-sm">
            <p className="text-xs text-blue-500 font-bold uppercase tracking-wider">出席</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{rsvps.filter(r => r.attendance === "yes").length} <span className="text-xs font-normal text-blue-500">名</span></p>
          </div>
          <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 text-center shadow-sm">
            <p className="text-xs text-rose-500 font-bold uppercase tracking-wider">欠席</p>
            <p className="text-2xl font-bold text-rose-700 mt-1">{rsvps.filter(r => r.attendance === "no").length} <span className="text-xs font-normal text-rose-500">名</span></p>
          </div>
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-center shadow-sm">
            <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">バス利用</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{rsvps.filter(r => r.bus === "yes").length} <span className="text-xs font-normal text-amber-500">名</span></p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center shadow-sm col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">内訳 (新郎/新婦)</p>
            <p className="text-base font-bold text-gray-700 mt-2">
              {rsvps.filter(r => r.side === "groom").length} / {rsvps.filter(r => r.side === "bride").length}
            </p>
          </div>
        </div>

        {/* データ一覧テーブル */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">お名前 / フリガナ</th>
                  <th className="px-6 py-4">出欠</th>
                  <th className="px-6 py-4">ご招待区分</th>
                  <th className="px-6 py-4">送迎バス</th>
                  <th className="px-6 py-4">アレルギー・備考・メッセージ</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRsvps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">該当するゲストデータが見つかりません。</td>
                  </tr>
                ) : (
                  filteredRsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{rsvp.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{rsvp.furigana}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${rsvp.attendance === "yes" ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"}`}>
                          {rsvp.attendance === "yes" ? "出席" : "欠席"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">
                        {rsvp.side === "groom" ? "新郎側" : "新婦側"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {rsvp.bus === "yes" ? <span className="text-amber-600 font-bold">🚌 必要</span> : <span className="text-gray-400">不要</span>}
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        {rsvp.allergy && (
                          <div className="text-xs text-rose-600 font-medium max-w-xs truncate" title={`アレルギー: ${rsvp.allergy}`}>
                            ⚠️ {rsvp.allergy}
                          </div>
                        )}
                        {rsvp.message && (
                          <div className="text-xs text-gray-500 max-w-xs truncate font-serif italic" title={`メッセージ: ${rsvp.message}`}>
                            「{rsvp.message}」
                          </div>
                        )}
                        {!rsvp.allergy && !rsvp.message && <span className="text-gray-300">ー</span>}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                        <button 
                          onClick={() => { setEditingRsvp(rsvp); setIsEditModalOpen(true); }}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          編集
                        </button>
                        <button 
                          onClick={() => handleDelete(rsvp.id)}
                          className="text-rose-600 hover:text-rose-800 font-bold"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* モーダルA：手動新規追加フォーム */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">ゲストの手動追加</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">氏名 *</label>
                  <input type="text" required value={newRsvp.name} onChange={e => setNewRsvp({...newRsvp, name: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50" placeholder="例: 織田 信長" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">フリガナ *</label>
                  <input type="text" required value={newRsvp.furigana} onChange={e => setNewRsvp({...newRsvp, furigana: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50" placeholder="例: オダ ノブナガ" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">出欠</label>
                  <select value={newRsvp.attendance} onChange={e => setNewRsvp({...newRsvp, attendance: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50">
                    <option value="yes">出席</option>
                    <option value="no">欠席</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">招待区分</label>
                  <select value={newRsvp.side} onChange={e => setNewRsvp({...newRsvp, side: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50">
                    <option value="groom">新郎側</option>
                    <option value="bride">新婦側</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">送迎バス</label>
                <select value={newRsvp.bus} onChange={e => setNewRsvp({...newRsvp, bus: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50">
                  <option value="no">不要</option>
                  <option value="yes">必要 (🚌 バス利用)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">アレルギー・特記事項</label>
                <textarea value={newRsvp.allergy} onChange={e => setNewRsvp({...newRsvp, allergy: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50" rows={2} placeholder="特になければ空欄" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">内々のメモ・メッセージ</label>
                <textarea value={newRsvp.message} onChange={e => setNewRsvp({...newRsvp, message: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50" rows={2} placeholder="親戚、友人、受付担当 など自由にメモ書きできます" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">キャンセル</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm shadow-sm">登録する</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* モーダルB：編集フォーム */}
      {isEditModalOpen && editingRsvp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">回答データの修正・編集</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">お名前</label>
                  <input type="text" value={editingRsvp.name} onChange={e => setEditingRsvp({...editingRsvp, name: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">フリガナ</label>
                  <input type="text" value={editingRsvp.furigana} onChange={e => setEditingRsvp({...editingRsvp, furigana: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">出欠ステータス</label>
                  <select value={editingRsvp.attendance || "yes"} onChange={e => setEditingRsvp({...editingRsvp, attendance: e.target.value})} className="w-full border p-2 rounded-lg text-sm">
                    <option value="yes">出席</option>
                    <option value="no">欠席</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">ご招待区分</label>
                  <select value={editingRsvp.side || "groom"} onChange={e => setEditingRsvp({...editingRsvp, side: e.target.value})} className="w-full border p-2 rounded-lg text-sm">
                    <option value="groom">新郎側</option>
                    <option value="bride">新婦側</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">送迎バス</label>
                <select value={editingRsvp.bus || "no"} onChange={e => setEditingRsvp({...editingRsvp, bus: e.target.value})} className="w-full border p-2 rounded-lg text-sm">
                  <option value="no">不要</option>
                  <option value="yes">必要 (🚌 バス利用)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">アレルギー・特記事項</label>
                <textarea value={editingRsvp.allergy || ""} onChange={e => setEditingRsvp({...editingRsvp, allergy: e.target.value})} className="w-full border p-2 rounded-lg text-sm" rows={2} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">メッセージ・管理者用メモ</label>
                <textarea value={editingRsvp.message || ""} onChange={e => setEditingRsvp({...editingRsvp, message: e.target.value})} className="w-full border p-2 rounded-lg text-sm" rows={2} />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">閉じる</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm shadow-sm">変更を保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}