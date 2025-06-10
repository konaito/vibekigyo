'use client'

import { useState } from 'react'
import Image from 'next/image'
import { signInWithOTP } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'
import image from "./icon.png"

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [selectedApp, setSelectedApp] = useState<'business' | 'app'>('business')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    const { error } = await signInWithOTP(email)
    
    if (error) {
      setMessage(`エラー: ${error.message}`)
    } else {
      setMessage('メールを送信しました。受信したワンタイムパスワードを入力してください。')
      setStep('otp')
    }
    
    setIsLoading(false)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    })

    if (error) {
      setMessage(`エラー: ${error.message}`)
    } else {
      setMessage('ログインに成功しました。リダイレクトしています...')
      const redirectUrl = selectedApp === 'business' ? '/' : '/code'
      window.location.href = redirectUrl
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }}></div>

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Panel - Hero Content */}
          <div className="text-center lg:text-left">
            <div className="mb-12">
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="text-gray-900">vibe</span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">起業.md</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                AIとの対話で企画書・技術仕様書を生成<br />
                <span className="text-blue-600 font-semibold">vibeコーディング時代</span>の新しい起業プラットフォーム
              </p>
            </div>

            {/* Both Apps Description */}
            <div className="space-y-8 mb-12">
              {/* vibe起業.md */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-3">💼</span>
                  vibe起業.md
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  AIとの壁打ちでビジネス企画書を生成する起業家支援プラットフォーム
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🎯</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">市場調査から事業計画まで</h4>
                      <p className="text-gray-600 text-sm">投資家が欲しがる企画書を自動生成</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">💡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">AIとの壁打ち対話</h4>
                      <p className="text-gray-600 text-sm">アイデアを形にする思考パートナー</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* vibeアプリ.md */}
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  vibeアプリ.md
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  vibeコーディングのための技術仕様書を生成するAI開発支援ツール
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🔧</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">vibeコーディング用企画書</h4>
                      <p className="text-gray-600 text-sm">自然言語から技術仕様書を自動生成</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🚀</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">開発効率10倍UP</h4>
                      <p className="text-gray-600 text-sm">UI設計・API定義・コード生成まで</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-6 text-gray-500 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                GPT-o3対応
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                リアルタイム生成
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                インライン編集
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <Image 
                      src={image} 
                      alt="vibe起業.md"
                      width={48}
                      height={48}
                      className="w-full h-full rounded-xl shadow-lg"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    ログイン
                  </h2>
                  <p className="text-sm text-gray-600">
                    AIとの対話を始めましょう
                  </p>
                </div>

                {/* App Selection Toggle */}
                <div className="mb-5">
                  <div className="bg-gray-100 p-1 rounded-xl flex">
                    <button
                      onClick={() => setSelectedApp('business')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex flex-col items-center ${
                        selectedApp === 'business'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <span>💼 vibe起業.md</span>
                      <span className="text-xs text-gray-500 mt-1">ビジネス企画書を生成</span>
                    </button>
                    <button
                      onClick={() => setSelectedApp('app')}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex flex-col items-center ${
                        selectedApp === 'app'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <span>⚡ vibeアプリ.md</span>
                      <span className="text-xs text-gray-500 mt-1">vibeコーディングのための企画書を生成</span>
                    </button>
                  </div>
                </div>

                {step === 'email' ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          メール送信中...
                        </div>
                      ) : (
                        'ワンタイムパスワードを送信'
                      )}
                    </button>

                    {message && (
                      <div className={`p-4 rounded-xl text-sm border ${
                        message.startsWith('エラー') 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {message}
                      </div>
                    )}
                  </form>
                ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                        ワンタイムパスワード
                      </label>
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-center text-xl tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        {email} に送信されたコードを入力してください
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          認証中...
                        </div>
                      ) : (
                        'ログイン'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep('email')
                        setOtp('')
                        setMessage('')
                      }}
                      className="w-full py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>←</span>
                      <span>メールアドレスを変更</span>
                    </button>

                    {message && (
                      <div className={`p-4 rounded-xl text-sm border ${
                        message.startsWith('エラー') 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {message}
                      </div>
                    )}
                  </form>
                )}

                <div className="mt-8 text-center">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    ログインすることで、
                    <a href="#" className="text-blue-600 hover:underline">利用規約</a>と
                    <a href="#" className="text-blue-600 hover:underline">プライバシーポリシー</a>に同意したものとみなされます
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-green-600 font-medium mb-3">今だけ完全無料で利用可能</p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span>✓ 無制限で企画書生成</span>
                    <span>✓ 全AI機能利用可能</span>
                    <span>✓ アプリ間連携</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}