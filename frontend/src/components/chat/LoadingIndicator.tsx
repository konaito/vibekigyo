export default function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white/90 border border-gray-100 p-4 rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}