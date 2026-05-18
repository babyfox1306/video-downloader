"use client";

import { useState, useMemo, useRef } from "react";

// Force dynamic rendering (no SSR for Soundboard to avoid hydration mismatch on Audio)
export const dynamic = "force-dynamic";

// 50 viral sounds divided into 4 categories: meme, game, effect, notification
const SOUNDS = [
  // --- MEME (15 sounds) ---
  {
    id: 1,
    name: "Bruh",
    category: "meme",
    emoji: "💀",
    url: "https://www.myinstants.com/media/sounds/bruh.mp3"
  },
  {
    id: 2,
    name: "Vine Boom",
    category: "meme",
    emoji: "💥",
    url: "https://www.myinstants.com/media/sounds/vine-boom.mp3"
  },
  {
    id: 3,
    name: "Roblox Oof",
    category: "meme",
    emoji: "🧸",
    url: "https://www.myinstants.com/media/sounds/roblox-oof.mp3"
  },
  {
    id: 4,
    name: "Nyan Cat",
    category: "meme",
    emoji: "🐱",
    url: "https://www.myinstants.com/media/sounds/nyan-cat.mp3"
  },
  {
    id: 5,
    name: "Among Us Sus",
    category: "meme",
    emoji: "🚨",
    url: "https://www.myinstants.com/media/sounds/among-us-sus.mp3"
  },
  {
    id: 6,
    name: "Airhorn",
    category: "meme",
    emoji: "📢",
    url: "https://www.myinstants.com/media/sounds/mlg-airhorn.mp3"
  },
  {
    id: 7,
    name: "Sad Violin",
    category: "meme",
    emoji: "🎻",
    url: "https://www.myinstants.com/media/sounds/sad-violin.mp3"
  },
  {
    id: 8,
    name: "Anime Wow",
    category: "meme",
    emoji: "😮",
    url: "https://www.myinstants.com/media/sounds/anime-wow.mp3"
  },
  {
    id: 9,
    name: "Woman Laughing",
    category: "meme",
    emoji: "😂",
    url: "https://www.myinstants.com/media/sounds/woman-laughing.mp3"
  },
  {
    id: 10,
    name: "Crickets Meme",
    category: "meme",
    emoji: "🦗",
    url: "https://www.myinstants.com/media/sounds/crickets.mp3"
  },
  {
    id: 11,
    name: "Sad Trombone",
    category: "meme",
    emoji: "🎺",
    url: "https://www.myinstants.com/media/sounds/sad-trombone.mp3"
  },
  {
    id: 12,
    name: "Tada",
    category: "meme",
    emoji: "🎉",
    url: "https://www.myinstants.com/media/sounds/tada.mp3"
  },
  {
    id: 13,
    name: "Galaxy Brain",
    category: "meme",
    emoji: "🧠",
    url: "https://www.myinstants.com/media/sounds/galaxy-brain.mp3"
  },
  {
    id: 14,
    name: "Dramatic Hamster",
    category: "meme",
    emoji: "🐹",
    url: "https://www.myinstants.com/media/sounds/dramatic.mp3"
  },
  {
    id: 15,
    name: "Windows XP Error",
    category: "meme",
    emoji: "💻",
    url: "https://www.myinstants.com/media/sounds/windows-xp-error.mp3"
  },

  // --- GAME (15 sounds) ---
  {
    id: 16,
    name: "Minecraft Hurt",
    category: "game",
    emoji: "🟩",
    url: "https://www.myinstants.com/media/sounds/classic_hurt.mp3"
  },
  {
    id: 17,
    name: "Minecraft TNT",
    category: "game",
    emoji: "🧨",
    url: "https://www.myinstants.com/media/sounds/tnt-explosion.mp3"
  },
  {
    id: 18,
    name: "Mario Jump",
    category: "game",
    emoji: "🍄",
    url: "https://www.myinstants.com/media/sounds/mario-jump.mp3"
  },
  {
    id: 19,
    name: "Mario Coin",
    category: "game",
    emoji: "🪙",
    url: "https://www.myinstants.com/media/sounds/mario-coin.mp3"
  },
  {
    id: 20,
    name: "Zelda Chest",
    category: "game",
    emoji: "🗝️",
    url: "https://www.myinstants.com/media/sounds/zelda-chest.mp3"
  },
  {
    id: 21,
    name: "Sonic Ring",
    category: "game",
    emoji: "🌀",
    url: "https://www.myinstants.com/media/sounds/sonic-ring-sound.mp3"
  },
  {
    id: 22,
    name: "Pacman Death",
    category: "game",
    emoji: "👾",
    url: "https://www.myinstants.com/media/sounds/pacman-die.mp3"
  },
  {
    id: 23,
    name: "Tetris Theme",
    category: "game",
    emoji: "🧱",
    url: "https://www.myinstants.com/media/sounds/tetris-theme.mp3"
  },
  {
    id: 24,
    name: "CS Headshot",
    category: "game",
    emoji: "🎯",
    url: "https://www.myinstants.com/media/sounds/headshot.mp3"
  },
  {
    id: 25,
    name: "COD Tactical Nuke",
    category: "game",
    emoji: "☢️",
    url: "https://www.myinstants.com/media/sounds/tactical-nuke.mp3"
  },
  {
    id: 26,
    name: "Among Us Emergency",
    category: "game",
    emoji: "🚨",
    url: "https://www.myinstants.com/media/sounds/among-us-emergency-meeting.mp3"
  },
  {
    id: 27,
    name: "Among Us Kill",
    category: "game",
    emoji: "🔪",
    url: "https://www.myinstants.com/media/sounds/among-us-kill.mp3"
  },
  {
    id: 28,
    name: "Fortnite Dance",
    category: "game",
    emoji: "🕺",
    url: "https://www.myinstants.com/media/sounds/default-dance.mp3"
  },
  {
    id: 29,
    name: "CR Elixir Drop",
    category: "game",
    emoji: "🧪",
    url: "https://www.myinstants.com/media/sounds/elixir.mp3"
  },
  {
    id: 30,
    name: "Pikachu Cry",
    category: "game",
    emoji: "⚡",
    url: "https://www.myinstants.com/media/sounds/pikachu.mp3"
  },

  // --- EFFECT (10 sounds) ---
  {
    id: 31,
    name: "Applause",
    category: "effect",
    emoji: "👏",
    url: "https://assets.mixkit.co/active_storage/sfx/2816/2816-preview.mp3"
  },
  {
    id: 32,
    name: "Booing",
    category: "effect",
    emoji: "👎",
    url: "https://www.myinstants.com/media/sounds/booing.mp3"
  },
  {
    id: 33,
    name: "Crickets SFX",
    category: "effect",
    emoji: "🦗",
    url: "https://www.myinstants.com/media/sounds/crickets.mp3"
  },
  {
    id: 34,
    name: "Drum Roll",
    category: "effect",
    emoji: "🥁",
    url: "https://www.myinstants.com/media/sounds/drum-roll.mp3"
  },
  {
    id: 35,
    name: "Cymbal Crash",
    category: "effect",
    emoji: "🟡",
    url: "https://www.myinstants.com/media/sounds/cymbal.mp3"
  },
  {
    id: 36,
    name: "Bell Ding",
    category: "effect",
    emoji: "🔔",
    url: "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3"
  },
  {
    id: 37,
    name: "Pop Bubble",
    category: "effect",
    emoji: "🎈",
    url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"
  },
  {
    id: 38,
    name: "Swoosh",
    category: "effect",
    emoji: "💨",
    url: "https://www.myinstants.com/media/sounds/swoosh.mp3"
  },
  {
    id: 39,
    name: "Laser Beam",
    category: "effect",
    emoji: "🔫",
    url: "https://www.myinstants.com/media/sounds/laser.mp3"
  },
  {
    id: 40,
    name: "Explosion Boom",
    category: "effect",
    emoji: "💥",
    url: "https://www.myinstants.com/media/sounds/explosion.mp3"
  },

  // --- NOTIFICATION (10 sounds) ---
  {
    id: 41,
    name: "Discord Ping",
    category: "notification",
    emoji: "💬",
    url: "https://www.myinstants.com/media/sounds/discord-notification.mp3"
  },
  {
    id: 42,
    name: "Messenger Ring",
    category: "notification",
    emoji: "🔵",
    url: "https://www.myinstants.com/media/sounds/messenger.mp3"
  },
  {
    id: 43,
    name: "Apple Pay Pay",
    category: "notification",
    emoji: "💳",
    url: "https://www.myinstants.com/media/sounds/apple-pay.mp3"
  },
  {
    id: 44,
    name: "Android Notif",
    category: "notification",
    emoji: "🤖",
    url: "https://www.myinstants.com/media/sounds/android-notification.mp3"
  },
  {
    id: 45,
    name: "FaceTime Call",
    category: "notification",
    emoji: "📞",
    url: "https://www.myinstants.com/media/sounds/facetime.mp3"
  },
  {
    id: 46,
    name: "WhatsApp Ping",
    category: "notification",
    emoji: "🟢",
    url: "https://www.myinstants.com/media/sounds/whatsapp.mp3"
  },
  {
    id: 47,
    name: "Telegram Ping",
    category: "notification",
    emoji: "✈️",
    url: "https://www.myinstants.com/media/sounds/telegram-notification.mp3"
  },
  {
    id: 48,
    name: "Email Sent",
    category: "notification",
    emoji: "✉️",
    url: "https://www.myinstants.com/media/sounds/mail-sent.mp3"
  },
  {
    id: 49,
    name: "Slack Ping",
    category: "notification",
    emoji: "🟨",
    url: "https://www.myinstants.com/media/sounds/slack.mp3"
  },
  {
    id: 50,
    name: "MS Teams Call",
    category: "notification",
    emoji: "💜",
    url: "https://www.myinstants.com/media/sounds/teams-ringtone.mp3"
  }
];

const CATEGORIES = ["all", "meme", "game", "effect", "notification"];

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

  const playSound = (sound: typeof SOUNDS[0]) => {
    setError(null);
    
    // Stop current sound if playing
    if (playingId !== null) {
      const currentAudio = audioRefs.current.get(playingId);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      
      // If user clicked the same sound that was playing, just stop it and return
      if (playingId === sound.id) {
        setPlayingId(null);
        return;
      }
    }

    // Get or create audio element
    let audio = audioRefs.current.get(sound.id);
    if (!audio) {
      audio = new Audio(sound.url);
      
      // Note: By NOT setting crossOrigin, browser handles standard playback perfectly
      // without CORS limitations. If it still fails, the error handler will fallback.
      audioRefs.current.set(sound.id, audio);
      
      audio.onended = () => {
        setPlayingId(null);
      };

      audio.onerror = () => {
        console.error(`Failed to load sound: ${sound.name}`);
        setPlayingId(null);
        // Fallback: Mở liên kết trực tiếp trong tab mới
        window.open(sound.url, "_blank");
        setError(`"${sound.name}" gặp sự cố CORS/Mạng. Đã tự động mở liên kết trực tiếp để phát trong tab mới.`);
      };
    }

    try {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayingId(sound.id);
          })
          .catch((err) => {
            console.error("Autoplay / playback blocked:", err);
            setPlayingId(null);
            if (err.name === "NotAllowedError") {
              setError("Trình duyệt chặn tự động phát. Vui lòng nhấn nút phát một lần nữa.");
            } else {
              window.open(sound.url, "_blank");
              setError(`Không thể phát "${sound.name}". Đã tự động mở liên kết phát trực tiếp trong tab mới.`);
            }
          });
      }
    } catch (err: any) {
      console.error("Play error:", err);
      setPlayingId(null);
      window.open(sound.url, "_blank");
      setError(`Lỗi phát: ${err.message || "Không xác định"}. Đã mở liên kết trong tab mới.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Soundboard
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {SOUNDS.length} âm thanh viral cực chất - Click để phát ngay, tải về miễn phí!
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg flex justify-between items-center">
            <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-600 dark:text-red-400 underline font-semibold ml-4 hover:no-underline"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm âm thanh (Bruh, Minecraft, FaceTime...)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors capitalize font-semibold cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "Tất cả" : cat}
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 p-4 border border-gray-100 dark:border-gray-750 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg mb-3 flex items-center justify-center shadow-inner relative overflow-hidden group">
                  {playingId === sound.id ? (
                    <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-20"></div>
                  ) : null}
                  {playingId === sound.id ? (
                    <div className="animate-pulse text-5xl z-10">🔊</div>
                  ) : (
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-200 z-10 select-none">
                      {sound.emoji || "🎵"}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3 line-clamp-2 text-center h-10 flex items-center justify-center">
                  {sound.name}
                </h3>
              </div>
              <div className="flex gap-2 w-full mt-auto">
                <button
                  onClick={() => playSound(sound)}
                  className={`flex-1 px-3 py-2 text-white rounded-lg transition-colors text-xs font-bold flex items-center justify-center cursor-pointer shadow-sm ${
                    playingId === sound.id
                      ? "bg-red-650 hover:bg-red-750"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  title={playingId === sound.id ? "Dừng âm thanh" : "Phát âm thanh"}
                >
                  {playingId === sound.id ? "⏸ Dừng" : "▶ Phát"}
                </button>
                <a
                  href={sound.url}
                  download={`${sound.name}.mp3`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs font-bold flex items-center justify-center shadow-sm cursor-pointer"
                  title="Tải về file MP3"
                >
                  ⬇ Tải
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredSounds.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-750">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Không tìm thấy âm thanh nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}

        <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="font-medium">Tất cả các hiệu ứng âm thanh đều miễn phí và thuộc phạm vi công cộng.</p>
          <p className="text-xs mt-2 text-gray-400">
            Mẹo: Nếu bấm nút phát bị lỗi do chặn CORS từ server gốc, hệ thống sẽ tự động mở âm thanh trong tab mới để bạn nghe và tải về trực tiếp.
          </p>
        </div>
      </div>
    </div>
  );
}
