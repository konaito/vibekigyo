interface HeaderProps {
  title: string;
  appSwitchUrl: string;
  appSwitchLabel: string;
  userLevel?: 'beginner' | 'engineer';
  onUserLevelChange?: (level: 'beginner' | 'engineer') => void;
}

export default function Header({ title, appSwitchUrl, appSwitchLabel, userLevel, onUserLevelChange }: HeaderProps) {
  return (
    <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm flex-shrink-0 shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h1>
        <div className="flex items-center space-x-4">
          {/* ユーザーレベルトグル - 技術仕様書ページのみ */}
          {userLevel && onUserLevelChange && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">レベル:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => onUserLevelChange('beginner')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                    userLevel === 'beginner'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🔰 初心者
                </button>
                <button
                  onClick={() => onUserLevelChange('engineer')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                    userLevel === 'engineer'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  ⚙️ エンジニア
                </button>
              </div>
            </div>
          )}
          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = appSwitchUrl}
              className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                appSwitchLabel.includes('vibe起業') 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              }`}
              title={`${appSwitchLabel}に切り替え`}
            >
              {appSwitchLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}