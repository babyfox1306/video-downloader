export default function TTSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TTS Clip Maker
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 mb-8">
          <div className="mb-6">
            <div className="inline-block animate-spin text-6xl mb-4">⚡</div>
            <p className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Đang làm rất nhanh, bà con chờ tí nhé ❤
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Tính năng TTS Clip Maker đang được phát triển, sẽ ra mắt sớm nhất có thể!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
