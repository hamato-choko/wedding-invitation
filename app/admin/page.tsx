// app/admin/page.tsx
import { Metadata } from "next";
import AdminForm from "./AdminForm"; // 💡 作成するAdminFormをインポート

export const metadata: Metadata = {
  title: "管理者ダッシュボード | Wedding RSVP Admin",
  description: "結婚式招待状の回答データ管理画面です。",
};

export default function AdminPage() {
  return <AdminForm />;
}