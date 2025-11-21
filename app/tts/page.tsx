import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZavClip TTS Clip Maker - Coming Soon",
  description: "ZavClip TTS Clip Maker - Generate viral clips with text-to-speech. Coming soon!",
};

export default function TTSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TTS Clip Maker
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label htmlFor="tts-text" className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Enter Text
            </label>
            <textarea
              id="tts-text"
              placeholder="Type your text here..."
              rows={6}
              disabled
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white opacity-60 cursor-not-allowed"
            />
          </div>
          
          <button
            disabled
            title="Coming soon"
            className="w-full bg-gray-400 dark:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg cursor-not-allowed opacity-60"
          >
            Generate Clip
          </button>
          
          <p className="mt-4 text-center text-gray-500 dark:text-gray-400 italic">
            Coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

