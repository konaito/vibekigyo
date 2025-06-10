"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Rocket, Code2, FileText, RefreshCw, Layers } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Header */}
      <header className="w-full border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">vibe起業.md</h1>
          <nav className="space-x-4">
            <a href="#features" className="text-sm hover:underline">
              機能
            </a>
            <a href="#pricing" className="text-sm hover:underline">
              料金
            </a>
            <a href="https://app.vibekigyo.com" className="text-sm hover:underline">
              ログイン
            </a>
            <Button asChild>
              <a href="https://app.vibekigyo.com/signup">無料で始める</a>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center text-center py-24">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            AI×ビジネス企画書・技術仕様書生成
            <br className="hidden md:block" />
            プラットフォーム
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg md:text-xl text-slate-600"
          >
            “壁打ち”も“仕様書”も、AIと一緒に
            <span className="font-semibold">10×スピード</span>で。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex gap-4"
          >
            <Button size="lg" asChild>
              <a href="https://app.vibekigyo.com/signup">無料で始める</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">機能を見る</a>
            </Button>
          </motion.div>
        </section>

        {/* Dual App Section */}
        <section id="features" className="container mx-auto py-20">
          <h3 className="text-center text-3xl md:text-4xl font-bold mb-12">
            デュアルアプリで企画から開発までシームレス
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                <h4 className="text-xl font-semibold">vibe起業.md</h4>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-600">
                <p>
                  AIアシスタントが<strong>ビジネス企画書</strong>を生成。ターゲット設定からリスク分析まで1クリック。
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>プロジェクト概要 / 価値提案 / 競合分析</li>
                  <li>収益モデル / マーケティング戦略 / 今後のロードマップ</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex items-center gap-2">
                <Code2 className="w-6 h-6" />
                <h4 className="text-xl font-semibold">vibeアプリ.md</h4>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-600">
                <p>
                  ビジネス企画を<strong>技術仕様書</strong>に高速変換。UI設計・API設計・スケジュールまで自動。
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>技術スタック / UI・UX構成 / API定義</li>
                  <li>開発スケジュール / リスクと対策</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Features */}
        <section className="bg-slate-50 py-20">
          <div className="container mx-auto">
            <h3 className="text-center text-3xl md:text-4xl font-bold mb-12">
              核心機能
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="flex flex-col items-center gap-2">
                  <Rocket className="w-10 h-10" />
                  <h4 className="text-xl font-semibold">リアルタイムAI生成</h4>
                </CardHeader>
                <CardContent className="text-center text-slate-600">
                  GPT‑4o があなたの入力に即応。チャット×Markdownで瞬時に文書更新。
                </CardContent>
              </Card>
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="flex flex-col items-center gap-2">
                  <Layers className="w-10 h-10" />
                  <h4 className="text-xl font-semibold">インライン編集</h4>
                </CardHeader>
                <CardContent className="text-center text-slate-600">
                  クリックで直接編集、<kbd>Cmd</kbd>+<kbd>S</kbd> で保存。AIが編集を理解し次の提案へ。
                </CardContent>
              </Card>
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="flex flex-col items-center gap-2">
                  <RefreshCw className="w-10 h-10" />
                  <h4 className="text-xl font-semibold">seamless連携</h4>
                </CardHeader>
                <CardContent className="text-center text-slate-600">
                  ローカル環境でもURLパラメータで安全に企画書→仕様書をハンドオフ。
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="container mx-auto py-20">
          <h3 className="text-center text-3xl md:text-4xl font-bold mb-12">料金プラン</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="p-6 border border-slate-200">
              <CardHeader className="text-center">
                <h4 className="text-2xl font-semibold">Free</h4>
                <p className="mt-2 text-3xl font-bold">
                  ¥0<span className="text-base font-normal">/月</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc ml-4 text-slate-600">
                  <li>月5企画書まで</li>
                  <li>基本機能</li>
                </ul>
                <Button className="w-full mt-4" asChild>
                  <a href="https://app.vibekigyo.com/signup">登録</a>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="p-6 border-2 border-indigo-600 shadow-lg">
              <CardHeader className="text-center">
                <h4 className="text-2xl font-semibold text-indigo-600">Pro</h4>
                <p className="mt-2 text-3xl font-bold text-indigo-600">
                  ¥2,980<span className="text-base font-normal text-slate-800">/月</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc ml-4 text-slate-600">
                  <li>企画書・仕様書無制限</li>
                  <li>インライン編集 & AI履歴</li>
                  <li>エクスポート (PDF/PPTX)</li>
                </ul>
                <Button className="w-full mt-4" asChild>
                  <a href="https://app.vibekigyo.com/signup">無料トライアル</a>
                </Button>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card className="p-6 border border-slate-200">
              <CardHeader className="text-center">
                <h4 className="text-2xl font-semibold">Team</h4>
                <p className="mt-2 text-3xl font-bold">
                  ¥9,800<span className="text-base font-normal">/月</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc ml-4 text-slate-600">
                  <li>チーム共有・権限管理</li>
                  <li>専用サポート</li>
                  <li>管理ダッシュボード</li>
                </ul>
                <Button className="w-full mt-4" asChild>
                  <a href="https://app.vibekigyo.com/contact">お問い合わせ</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© 2025 vibe起業.md. All rights reserved.</p>
          <nav className="flex gap-4 text-sm">
            <a className="hover:underline" href="#top">
              トップ
            </a>
            <a className="hover:underline" href="https://github.com/konaito/vibekigyo">
              GitHub
            </a>
            <a className="hover:underline" href="mailto:support@vibekigyo.com">
              サポート
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
