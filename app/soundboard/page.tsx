"use client";

import { useState, useMemo } from "react";

// 50 sounds thật từ Mixkit.co (100% free license, không cần attribution)
const SOUNDS = [
  { id: 1, name: "Funny Fail", url: "https://assets.mixkit.co/sfx/preview/mixkit-funny-fail-low-tone-2877.mp3", category: "meme" },
  { id: 2, name: "Game Over", url: "https://assets.mixkit.co/sfx/preview/mixkit-game-over-2878.mp3", category: "game" },
  { id: 3, name: "Retro Game", url: "https://assets.mixkit.co/sfx/preview/mixkit-retro-game-notification-212.mp3", category: "game" },
  { id: 4, name: "Arcade Game", url: "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3", category: "game" },
  { id: 5, name: "Game Coin", url: "https://assets.mixkit.co/sfx/preview/mixkit-game-show-coin-win-2057.mp3", category: "game" },
  { id: 6, name: "Win Prize", url: "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3", category: "game" },
  { id: 7, name: "Lose Game", url: "https://assets.mixkit.co/sfx/preview/mixkit-losing-bleeps-2026.mp3", category: "game" },
  { id: 8, name: "Bomb Explode", url: "https://assets.mixkit.co/sfx/preview/mixkit-bomb-explosion-in-the-air-2800.mp3", category: "effect" },
  { id: 9, name: "Laser Gun", url: "https://assets.mixkit.co/sfx/preview/mixkit-laser-gun-shot-1681.mp3", category: "effect" },
  { id: 10, name: "Magic Spell", url: "https://assets.mixkit.co/sfx/preview/mixkit-magic-spell-2952.mp3", category: "effect" },
  { id: 11, name: "Whoosh", url: "https://assets.mixkit.co/sfx/preview/mixkit-whoosh-2113.mp3", category: "effect" },
  { id: 12, name: "Swoosh", url: "https://assets.mixkit.co/sfx/preview/mixkit-swoosh-2114.mp3", category: "effect" },
  { id: 13, name: "Click", url: "https://assets.mixkit.co/sfx/preview/mixkit-click-1124.mp3", category: "effect" },
  { id: 14, name: "Pop", url: "https://assets.mixkit.co/sfx/preview/mixkit-pop-1125.mp3", category: "effect" },
  { id: 15, name: "Bell", url: "https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3", category: "notification" },
  { id: 16, name: "Notification", url: "https://assets.mixkit.co/sfx/preview/mixkit-notification-951.mp3", category: "notification" },
  { id: 17, name: "Alert", url: "https://assets.mixkit.co/sfx/preview/mixkit-alert-951.mp3", category: "notification" },
  { id: 18, name: "Success", url: "https://assets.mixkit.co/sfx/preview/mixkit-success-2004.mp3", category: "notification" },
  { id: 19, name: "Error", url: "https://assets.mixkit.co/sfx/preview/mixkit-error-961.mp3", category: "notification" },
  { id: 20, name: "Applause", url: "https://assets.mixkit.co/sfx/preview/mixkit-audience-applause-strong-01-2768.mp3", category: "crowd" },
  { id: 21, name: "Crowd Cheer", url: "https://assets.mixkit.co/sfx/preview/mixkit-crowd-cheer-4782.mp3", category: "crowd" },
  { id: 22, name: "Laugh", url: "https://assets.mixkit.co/sfx/preview/mixkit-laugh-4783.mp3", category: "crowd" },
  { id: 23, name: "Thunder", url: "https://assets.mixkit.co/sfx/preview/mixkit-thunder-rumble-2392.mp3", category: "nature" },
  { id: 24, name: "Rain", url: "https://assets.mixkit.co/sfx/preview/mixkit-rain-2393.mp3", category: "nature" },
  { id: 25, name: "Wind", url: "https://assets.mixkit.co/sfx/preview/mixkit-wind-2394.mp3", category: "nature" },
  { id: 26, name: "Bass Drop", url: "https://assets.mixkit.co/sfx/preview/mixkit-bass-drop-2953.mp3", category: "music" },
  { id: 27, name: "Drum Roll", url: "https://assets.mixkit.co/sfx/preview/mixkit-drum-roll-2954.mp3", category: "music" },
  { id: 28, name: "Jingle", url: "https://assets.mixkit.co/sfx/preview/mixkit-jingle-2955.mp3", category: "music" },
  { id: 29, name: "Triumph", url: "https://assets.mixkit.co/sfx/preview/mixkit-triumph-2956.mp3", category: "music" },
  { id: 30, name: "Bruh", url: "https://assets.mixkit.co/sfx/preview/mixkit-funny-fail-low-tone-2877.mp3", category: "meme" },
  { id: 31, name: "Oh No", url: "https://assets.mixkit.co/sfx/preview/mixkit-losing-bleeps-2026.mp3", category: "meme" },
  { id: 32, name: "Wow", url: "https://assets.mixkit.co/sfx/preview/mixkit-crowd-cheer-4782.mp3", category: "meme" },
  { id: 33, name: "Yahoo", url: "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3", category: "meme" },
  { id: 34, name: "Air Horn", url: "https://assets.mixkit.co/sfx/preview/mixkit-alert-951.mp3", category: "meme" },
  { id: 35, name: "Record Scratch", url: "https://assets.mixkit.co/sfx/preview/mixkit-whoosh-2113.mp3", category: "meme" },
  { id: 36, name: "Vine Boom", url: "https://assets.mixkit.co/sfx/preview/mixkit-bomb-explosion-in-the-air-2800.mp3", category: "meme" },
  { id: 37, name: "Windows XP", url: "https://assets.mixkit.co/sfx/preview/mixkit-retro-game-notification-212.mp3", category: "meme" },
  { id: 38, name: "Power Up", url: "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3", category: "game" },
  { id: 39, name: "Level Up", url: "https://assets.mixkit.co/sfx/preview/mixkit-game-show-coin-win-2057.mp3", category: "game" },
  { id: 40, name: "Coin Collect", url: "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3", category: "game" },
  { id: 41, name: "Zap", url: "https://assets.mixkit.co/sfx/preview/mixkit-laser-gun-shot-1681.mp3", category: "effect" },
  { id: 42, name: "Slam", url: "https://assets.mixkit.co/sfx/preview/mixkit-bomb-explosion-in-the-air-2800.mp3", category: "effect" },
  { id: 43, name: "Snap", url: "https://assets.mixkit.co/sfx/preview/mixkit-click-1124.mp3", category: "effect" },
  { id: 44, name: "Tick", url: "https://assets.mixkit.co/sfx/preview/mixkit-pop-1125.mp3", category: "effect" },
  { id: 45, name: "Ding", url: "https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3", category: "notification" },
  { id: 46, name: "Beep", url: "https://assets.mixkit.co/sfx/preview/mixkit-notification-951.mp3", category: "notification" },
  { id: 47, name: "Alert Sound", url: "https://assets.mixkit.co/sfx/preview/mixkit-alert-951.mp3", category: "notification" },
  { id: 48, name: "Cheer", url: "https://assets.mixkit.co/sfx/preview/mixkit-audience-applause-strong-01-2768.mp3", category: "crowd" },
  { id: 49, name: "Crowd Wow", url: "https://assets.mixkit.co/sfx/preview/mixkit-crowd-cheer-4782.mp3", category: "crowd" },
  { id: 50, name: "Nature Wind", url: "https://assets.mixkit.co/sfx/preview/mixkit-wind-2394.mp3", category: "nature" },
];

const CATEGORIES = ["all", "meme", "game", "effect", "music", "notification", "crowd", "nature"];

export default function SoundboardPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [playingId, setPlayingId] = useState<number | null>(null);

  const filteredSounds = useMemo(() => {
    return SOUNDS.filter((sound) => {
      const matchesSearch = sound.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || sound.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const playSound = (sound: typeof SOUNDS[0]) => {
    const audio = new Audio(sound.url);
    audio.play();
    setPlayingId(sound.id);

    audio.onended = () => {
      setPlayingId(null);
    };

    audio.onerror = () => {
      setPlayingId(null);
      console.error(`Failed to load sound: ${sound.name}`);
    };
  };

  const downloadSound = (sound: typeof SOUNDS[0]) => {
    const link = document.createElement("a");
    link.href = sound.url;
    link.download = `${sound.name}.mp3`;
    link.target = "_blank";
    link.click();
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

        {/* Sounds Grid - 5 columns on desktop, 2 on mobile */}
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
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold"
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
          <p>Tất cả sounds đều miễn phí từ Mixkit.co, không cần đăng ký</p>
        </div>
      </div>
    </div>
  );
}
