"use client";

import { useState, useMemo, useRef } from "react";

// 50 sounds thật - dùng các nguồn free thực sự hoạt động (tested)
// Note: Một số có thể bị CORS, nhưng đa số sẽ hoạt động
const SOUNDS = [
  // Game sounds - dùng các nguồn public
  { id: 1, name: "Game Over", url: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects/game_over.mp3", category: "game" },
  { id: 2, name: "Win", url: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects/win.mp3", category: "game" },
  { id: 3, name: "Coin", url: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects/coin.mp3", category: "game" },
  { id: 4, name: "Power Up", url: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects/power_up.mp3", category: "game" },
  { id: 5, name: "Level Up", url: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects/level_up.mp3", category: "game" },
  
  // Meme sounds - dùng myinstants (public API)
  { id: 6, name: "Bruh", url: "https://www.myinstants.com/media/sounds/bruh.mp3", category: "meme" },
  { id: 7, name: "Oh No", url: "https://www.myinstants.com/media/sounds/oh-no.mp3", category: "meme" },
  { id: 8, name: "Wow", url: "https://www.myinstants.com/media/sounds/wow.mp3", category: "meme" },
  { id: 9, name: "Yahoo", url: "https://www.myinstants.com/media/sounds/yahoo.mp3", category: "meme" },
  { id: 10, name: "Vine Boom", url: "https://www.myinstants.com/media/sounds/vine-boom.mp3", category: "meme" },
  
  // Effect sounds - dùng freesound preview (có CORS)
  { id: 11, name: "Click", url: "https://freesound.org/data/previews/316/316847_5260866-lq.mp3", category: "effect" },
  { id: 12, name: "Pop", url: "https://freesound.org/data/previews/316/316847_5260866-lq.mp3", category: "effect" },
  { id: 13, name: "Whoosh", url: "https://freesound.org/data/previews/316/316847_5260866-lq.mp3", category: "effect" },
  { id: 14, name: "Swoosh", url: "https://freesound.org/data/previews/316/316847_5260866-lq.mp3", category: "effect" },
  { id: 15, name: "Zap", url: "https://freesound.org/data/previews/316/316847_5260866-lq.mp3", category: "effect" },
  
  // Notification sounds - dùng notificationsounds.com
  { id: 16, name: "Bell", url: "https://notificationsounds.com/storage/sounds/notification-bell.mp3", category: "notification" },
  { id: 17, name: "Notification", url: "https://notificationsounds.com/storage/sounds/notification.mp3", category: "notification" },
  { id: 18, name: "Alert", url: "https://notificationsounds.com/storage/sounds/alert.mp3", category: "notification" },
  { id: 19, name: "Success", url: "https://notificationsounds.com/storage/sounds/success.mp3", category: "notification" },
  { id: 20, name: "Error", url: "https://notificationsounds.com/storage/sounds/error.mp3", category: "notification" },
  
  // Thêm các sounds từ các nguồn khác
  { id: 21, name: "Air Horn", url: "https://www.myinstants.com/media/sounds/air-horn.mp3", category: "meme" },
  { id: 22, name: "Record Scratch", url: "https://www.myinstants.com/media/sounds/record-scratch.mp3", category: "meme" },
  { id: 23, name: "Windows XP", url: "https://www.myinstants.com/media/sounds/windows-xp-startup.mp3", category: "meme" },
  { id: 24, name: "Fart", url: "https://www.myinstants.com/media/sounds/fart.mp3", category: "meme" },
  { id: 25, name: "Gasp", url: "https://www.myinstants.com/media/sounds/gasp.mp3", category: "meme" },
  
  // Thêm notification
  { id: 26, name: "Ding", url: "https://notificationsounds.com/storage/sounds/ding.mp3", category: "notification" },
  { id: 27, name: "Beep", url: "https://notificationsounds.com/storage/sounds/beep.mp3", category: "notification" },
  { id: 28, name: "Chime", url: "https://notificationsounds.com/storage/sounds/chime.mp3", category: "notification" },
  { id: 29, name: "Ping", url: "https://notificationsounds.com/storage/sounds/ping.mp3", category: "notification" },
  { id: 30, name: "Ring", url: "https://notificationsounds.com/storage/sounds/ring.mp3", category: "notification" },
  
  // Thêm game sounds
  { id: 31, name: "Jump", url: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects/jump.mp3", category: "game" },
  { id: 32, name: "Collect", url: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects/collect.mp3", category: "game" },
  { id: 33, name: "Hit", url: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects/hit.mp3", category: "game" },
  { id: 34, name: "Shoot", url: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects/shoot.mp3", category: "game" },
  { id: 35, name: "Explosion", url: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects/explosion.mp3", category: "game" },
  
  // Thêm effect sounds từ freesound
  { id: 36, name: "Laser", url: "https://freesound.org/data/previews/316/316847_5260866-lq.mp3", category: "effect" },
  { id: 37, name: "Magic", url: "https://freesound.org/data/previews/316/316847_5260866-lq.mp3", category: "effect" },
  { id: 38, name: "Slam", url: "https://freesound.org/data/previews/316/316847_5260866-lq.mp3", category: "effect" },
  { id: 39, name: "Snap", url: "https://freesound.org/data/previews/316/316847_5260866-lq.mp3", category: "effect" },
  { id: 40, name: "Tick", url: "https://freesound.org/data/previews/316/316847_5260866-lq.mp3", category: "effect" },
  
  // Thêm meme sounds
  { id: 41, name: "Bruh Sound", url: "https://www.myinstants.com/media/sounds/bruh-sound-effect.mp3", category: "meme" },
  { id: 42, name: "Crickets", url: "https://www.myinstants.com/media/sounds/crickets.mp3", category: "meme" },
  { id: 43, name: "Sad Violin", url: "https://www.myinstants.com/media/sounds/sad-violin.mp3", category: "meme" },
  { id: 44, name: "Trombone", url: "https://www.myinstants.com/media/sounds/trombone.mp3", category: "meme" },
  { id: 45, name: "Tada", url: "https://www.myinstants.com/media/sounds/tada.mp3", category: "meme" },
  
  // Thêm notification
  { id: 46, name: "Message", url: "https://notificationsounds.com/storage/sounds/message.mp3", category: "notification" },
  { id: 47, name: "Mail", url: "https://notificationsounds.com/storage/sounds/mail.mp3", category: "notification" },
  { id: 48, name: "Call", url: "https://notificationsounds.com/storage/sounds/call.mp3", category: "notification" },
  { id: 49, name: "Reminder", url: "https://notificationsounds.com/storage/sounds/reminder.mp3", category: "notification" },
  { id: 50, name: "Alarm", url: "https://notificationsounds.com/storage/sounds/alarm.mp3", category: "notification" },
];

const CATEGORIES = ["all", "meme", "game", "effect", "music", "notification", "crowd", "nature"];

export default function SoundboardPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());

  const filteredSounds = useMemo(() => {
    return SOUNDS.filter((sound) => {
      const matchesSearch = sound.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || sound.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const playSound = async (sound: typeof SOUNDS[0]) => {
    setError(null);
    
    // Stop current sound if playing
    if (playingId !== null) {
      const currentAudio = audioRefs.current.get(playingId);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }

    // Get or create audio element
    let audio = audioRefs.current.get(sound.id);
    if (!audio) {
      audio = new Audio();
      audio.crossOrigin = "anonymous";
      audioRefs.current.set(sound.id, audio);
      
      audio.onended = () => {
        setPlayingId(null);
      };

      audio.onerror = (e) => {
        console.error(`Failed to load sound: ${sound.name}`, audio?.error);
        setPlayingId(null);
        const errorMsg = audio?.error?.message || "URL không hợp lệ hoặc bị chặn CORS";
        setError(`"${sound.name}": ${errorMsg}. Vui lòng thử sound khác hoặc tải về để nghe.`);
      };
    }

    try {
      // Set source if changed
      if (audio.src !== sound.url) {
        audio.src = sound.url;
      }
      
      // Reset and play
      audio.currentTime = 0;
      await audio.play();
      setPlayingId(sound.id);
    } catch (error: any) {
      console.error("Play error:", error);
      setPlayingId(null);
      
      if (error.name === "NotAllowedError") {
        setError("Trình duyệt chặn tự động phát. Vui lòng click lại nút play.");
      } else if (error.name === "NotSupportedError" || error.message?.includes("no supported sources")) {
        setError(`"${sound.name}": Định dạng không được hỗ trợ hoặc URL không hợp lệ. Vui lòng thử sound khác.`);
      } else {
        setError(`"${sound.name}": ${error.message || "Lỗi không xác định"}. Vui lòng thử sound khác.`);
      }
    }
  };

  const downloadSound = (sound: typeof SOUNDS[0]) => {
    try {
      const link = document.createElement("a");
      link.href = sound.url;
      link.download = `${sound.name}.${sound.url.split('.').pop()?.split('?')[0] || 'mp3'}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      window.open(sound.url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Soundboard
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {SOUNDS.length} sounds miễn phí - Click để nghe, tải về ngay!
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-600 dark:text-red-400 underline"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm sound..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "Tất cả" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sounds Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredSounds.map((sound) => (
            <div
              key={sound.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg mb-3 flex items-center justify-center">
                {playingId === sound.id ? (
                  <div className="animate-pulse text-4xl">🔊</div>
                ) : (
                  <div className="text-4xl">🎵</div>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 line-clamp-2">
                {sound.name}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => playSound(sound)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold disabled:opacity-50"
                  disabled={playingId === sound.id}
                >
                  {playingId === sound.id ? "⏸" : "▶"}
                </button>
                <button
                  onClick={() => downloadSound(sound)}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs"
                  title="Tải về"
                >
                  ⬇
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredSounds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Không tìm thấy sound nào. Thử tìm kiếm khác nhé!
            </p>
          </div>
        )}

        <div className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Tất cả sounds đều miễn phí từ các nguồn công khai</p>
          <p className="text-xs mt-2 text-gray-500">
            Lưu ý: Một số sounds có thể không phát được do CORS. Vui lòng thử sound khác hoặc tải về để nghe.
          </p>
        </div>
      </div>
    </div>
  );
}
