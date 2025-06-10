'use client';

import { useState, useEffect } from 'react';

export type UserLevel = 'beginner' | 'engineer';

export function useUserLevel() {
  const [userLevel, setUserLevel] = useState<UserLevel>('beginner');

  // ローカルストレージから設定を読み込み
  useEffect(() => {
    const saved = localStorage.getItem('userLevel');
    if (saved === 'beginner' || saved === 'engineer') {
      setUserLevel(saved);
    }
  }, []);

  // ユーザーレベル変更時にローカルストレージに保存
  const handleUserLevelChange = (level: UserLevel) => {
    setUserLevel(level);
    localStorage.setItem('userLevel', level);
  };

  return {
    userLevel,
    setUserLevel: handleUserLevelChange,
  };
}