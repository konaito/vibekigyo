interface HeaderProps {
  title: string;
  appSwitchUrl: string;
  appSwitchLabel: string;
  onClearHistory: () => void;
}

export default function Header({ title, appSwitchUrl, appSwitchLabel, onClearHistory }: HeaderProps) {
  return (
    <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm flex-shrink-0 shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{title}</h1>
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
          <button
            onClick={onClearHistory}
            className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg text-sm font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            title="チャット履歴をクリア"
          >
            履歴クリア
          </button>
        </div>
      </div>
    </div>
  );
}