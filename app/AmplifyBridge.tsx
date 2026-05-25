// app/AmplifyBridge.tsx
"use client";

import { ReactNode } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

// 🚀 画面が動き出すよりも前に、最優先で1回だけ確実に初期化します
Amplify.configure(outputs, { ssr: true });

export default function AmplifyBridge({ children }: { children: ReactNode }) {
  return <>{children}</>;
}