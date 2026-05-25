// app/admin/AdminForm.tsx
"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
// Amplify.configure は AmplifyBridge に任せたので、ここでのインポートは不要です！

import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

// クライアントの生成
const client = generateClient<Schema>();

function AdminForm({ signOut }: { signOut?: () => void }) {
  // 💡 必要な変数をすべてここで宣言します
  const [rsvps, setRsvps] = useState<Array<Schema["Rsvp"]["type"]>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRsvp, setEditingRsvp] = useState<Schema["Rsvp"]["type"] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // これがエラーの原因でした

  const [newRsvp, setNewRsvp] = useState({
    name: "", furigana: "", email: "", address: "", attendance: "yes", side: "groom", bus: "no", allergy: "", specialNotes: "", message: ""
  });
  
  // 💡 データ取得関数を外に出して、再利用しやすくしました
  const fetchRsvps = async () => {
    try {
      setLoading(true);
      const response = await client.models.Rsvp.list();
      if (response.data) {
        const sorted = [...response.data].sort((a, b) => 
          (a.furigana || "").localeCompare(b.furigana || "", "ja")
        );
        setRsvps(sorted);
      }
    } catch (err) {
      console.error("🔥データ取得エラー:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 初期化処理は不要！データ取得だけを確実に実行します
  useEffect(() => {
    fetchRsvps();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRsvp.name || !newRsvp.furigana || !newRsvp.address) return alert("名前とフリガナは必須です");
    try {
      await client.models.Rsvp.create({
        name: newRsvp.name, furigana: newRsvp.furigana, email: newRsvp.email || undefined, address: newRsvp.address,
        attendance: newRsvp.attendance, side: newRsvp.side, bus: newRsvp.bus,
        allergy: newRsvp.allergy || undefined, specialNotes: newRsvp.specialNotes || undefined, message: newRsvp.message || undefined,
      });
      setIsAddModalOpen(false);
      window.location.reload();
    } catch (err) { alert("追加に失敗しました"); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRsvp) return;
    try {
      await client.models.Rsvp.update({
        id: editingRsvp.id, name: editingRsvp.name, furigana: editingRsvp.furigana, email: editingRsvp.email,
        attendance: editingRsvp.attendance, side: editingRsvp.side, bus: editingRsvp.bus,
        allergy: editingRsvp.allergy, specialNotes: editingRsvp.specialNotes, message: editingRsvp.message,
      });
      setIsEditModalOpen(false);
      window.location.reload();
    } catch (err) { alert("更新に失敗しました"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このゲストの回答データを完全に削除してもよろしいですか？")) return;
    try {
      await client.models.Rsvp.delete({ id });
      window.location.reload();
    } catch (err) { alert("削除に失敗しました"); }
  };

  const filteredRsvps = rsvps.filter(r => r.name.includes(searchTerm) || r.furigana.includes(searchTerm));

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">セキュリティチェック中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">RSVP 管理ダッシュボード</h1>
            <p className="text-sm text-gray-500">🔒 セキュリティ保護された新郎新婦専用の画面です</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={signOut} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold rounded-lg transition-colors border border-gray-200">
              ログアウト
            </button>
            <input type="text" placeholder="お名前・フリガナで検索" className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-52" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors">
              ＋ 手動追加
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
            <p className="text-2xl font-bold text-rose-700 mt-1">{rsvps.filter(r => r.attendance === "no").length} <span className="text-xs font-normal text-rose-700">名</span></p>
          </div>
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-center shadow-sm">
            <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">バス利用</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{rsvps.filter(r => r.bus === "yes").length} <span className="text-xs font-normal text-amber-500">名</span></p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center shadow-sm col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">内訳 (新郎/新婦)</p>
            <p className="text-base font-bold text-gray-700 mt-2">{rsvps.filter(r => r.side === "groom").length} / {rsvps.filter(r => r.side === "bride").length}</p>
          </div>
        </div>

        {/* データ一覧テーブル */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">お名前 / フリガナ / メール</th>
                  <th className="px-6 py-4">住所</th>
                  <th className="px-6 py-4">出欠</th>
                  <th className="px-6 py-4">区分</th>
                  <th className="px-6 py-4">送迎バス</th>
                  <th className="px-6 py-4">アレルギー・特記事項・メッセージ</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRsvps.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">該当するゲストデータが見つかりません。</td></tr>
                ) : (
                  filteredRsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{rsvp.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{rsvp.furigana}</div>
                        {rsvp.email && <div className="text-xs text-gray-500 mt-1 select-all">{rsvp.email}</div>}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 max-w-[50px] truncate">{rsvp.address || "ー"}</td> {/* 💡 追加 */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${rsvp.attendance === "yes" ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"}`}>
                          {rsvp.attendance === "yes" ? "出席" : "欠席"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">{rsvp.side === "groom" ? "新郎側" : "新婦側"}</td>
                      <td className="px-6 py-4 text-gray-600">{rsvp.bus === "yes" ? <span className="text-amber-600 font-bold">🚌 必要</span> : <span className="text-gray-400">不要</span>}</td>
                      <td className="px-6 py-4 space-y-1">
                        {rsvp.allergy && <div className="text-xs text-rose-600 font-medium">⚠️ アレルギー: {rsvp.allergy}</div>}
                        {rsvp.specialNotes && <div className="text-xs text-amber-600 font-medium">📌 備考: {rsvp.specialNotes}</div>}
                        {rsvp.message && <div className="text-xs text-gray-500 font-serif italic max-w-xs truncate">「{rsvp.message}」</div>}
                        {!rsvp.allergy && !rsvp.specialNotes && !rsvp.message && <span className="text-gray-300">ー</span>}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                        <button onClick={() => { setEditingRsvp(rsvp); setIsEditModalOpen(true); }} className="text-blue-600 hover:text-blue-800 font-bold">編集</button>
                        <button onClick={() => handleDelete(rsvp.id)} className="text-rose-600 hover:text-rose-800 font-bold">削除</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* モーダルA：手動新規追加 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">ゲストの手動追加</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">氏名 *</label>
                  <input type="text" required value={newRsvp.name} onChange={e => setNewRsvp({...newRsvp, name: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">フリガナ *</label>
                    <input type="text" required value={newRsvp.furigana} onChange={e => setNewRsvp({...newRsvp, furigana: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">メールアドレス</label>
                <input type="email" value={newRsvp.email} onChange={e => setNewRsvp({...newRsvp, email: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50" />
              </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">住所</label>
                <input type="address" value={newRsvp.address} onChange={e => setNewRsvp({...newRsvp, address: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50" />
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
                <label className="block text-xs font-bold text-gray-500 mb-1">アレルギー・苦手な食べ物</label>
                <textarea value={newRsvp.allergy} onChange={e => setNewRsvp({...newRsvp, allergy: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50" rows={1} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">特記事項・ご要望</label>
                <textarea value={newRsvp.specialNotes} onChange={e => setNewRsvp({...newRsvp, specialNotes: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50" rows={1} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">新郎新婦へのメッセージ</label>
                <textarea value={newRsvp.message} onChange={e => setNewRsvp({...newRsvp, message: e.target.value})} className="w-full border p-2 rounded-lg text-sm bg-gray-50" rows={2} />
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
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
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
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">メールアドレス</label>
                <input type="email" value={editingRsvp.email || ""} onChange={e => setEditingRsvp({...editingRsvp, email: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">住所</label>
                <input type="text" value={editingRsvp.address || ""} onChange={e => setEditingRsvp({...editingRsvp, address: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
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
                <label className="block text-xs font-bold text-gray-500 mb-1">アレルギー・苦手な食べ物</label>
                <textarea value={editingRsvp.allergy || ""} onChange={e => setEditingRsvp({...editingRsvp, allergy: e.target.value})} className="w-full border p-2 rounded-lg text-sm" rows={1} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">特記事項・ご要望</label>
                <textarea value={editingRsvp.specialNotes || ""} onChange={e => setEditingRsvp({...editingRsvp, specialNotes: e.target.value})} className="w-full border p-2 rounded-lg text-sm" rows={1} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">メッセージ</label>
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

// 💡 ユーザー名ではなく「Email」をログインの仕組みにする設定
const formFields = {
  signIn: {
    username: { placeholder: 'メールアドレスを入力', label: 'Eメールアドレス', isRequired: true },
    password: { placeholder: 'パスワードを入力', label: 'パスワード', isRequired: true },
  },
  signUp: {
    email: { placeholder: 'メールアドレスを入力', label: 'Eメールアドレス', isRequired: true },
    password: { placeholder: '8文字以上のパスワード', label: 'パスワード', isRequired: true },
    confirm_password: { placeholder: 'パスワードを再入力', label: 'パスワード（確認）', isRequired: true },
  },
};

export default withAuthenticator(AdminForm, {
  formFields: formFields,
  // 💡 ここを 'email' に変更！
  loginMechanisms: ['email'] 
});