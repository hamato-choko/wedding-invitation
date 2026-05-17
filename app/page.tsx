// app/page.tsx （"use client" は付けません）
import RsvpForm from "./RsvpForm";

// 💡 ここで安全にタブのタイトルを設定します
export const metadata = {
  title: "ご出欠のお伺い | Wedding Invitation",
  description: "ご結婚式のご出欠登録フォームです。必要事項をご記入の上、ご回答をお願いいたします。",
};

export default function RsvpPage() {
  return <RsvpForm />;
}