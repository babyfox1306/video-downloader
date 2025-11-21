import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { url } = JSON.parse(event.body || '{}');

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL is required' }),
      };
    }

    // Extract video info and download links
    const downloadLinks = await extractDownloadLinks(url);

    if (downloadLinks.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Unable to extract download links' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        downloadLinks,
      }),
    };
  } catch (error: any) {
    console.error('Download error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to process video' }),
    };
  }
};

async function extractDownloadLinks(url: string): Promise<any[]> {
  const links: any[] = [];

  try {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        // Try multiple YouTube download APIs
        const apis = [
          `https://api.vevioz.com/api/convert/mp4/${videoId}`,
          `https://yt-api.p.rapidapi.com/dl?id=${videoId}`,
        ];

        for (const apiUrl of apis) {
          try {
            const response = await fetch(apiUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0',
              },
            }).catch(() => null);

            if (response?.ok) {
              const data = await response.json();
              if (data.download || data.link) {
                links.push({
                  url: data.download || data.link,
                  quality: data.quality || 'HD',
                  format: 'mp4',
                  size: data.size || '',
                });
                break; // Success, no need to try other APIs
              }
            }
          } catch (e) {
            continue;
          }
        }

        // Fallback: Use yt-dlp wrapper API
        if (links.length === 0) {
          try {
            const ytdlpResponse = await fetch(
              `https://api.download-lagu-mp3.com/@api/button/mp3/${videoId}`
            ).catch(() => null);
            // This is just an example, need proper yt-dlp API
          } catch (e) {
            // Ignore
          }
        }
      }
    }

    // TikTok
    if (url.includes('tiktok.com')) {
      const apis = [
        `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
        `https://tikwm.com/api?url=${encodeURIComponent(url)}`,
        `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${extractTikTokId(url)}`,
      ];

      for (const apiUrl of apis) {
        try {
          const response = await fetch(apiUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0',
            },
          }).catch(() => null);

          if (response?.ok) {
            const data = await response.json();
            if (data.video?.noWatermark || data.data?.play) {
              links.push({
                url: data.video?.noWatermark || data.data?.play,
                quality: 'HD',
                format: 'mp4',
              });
              break;
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    // Instagram
    if (url.includes('instagram.com')) {
      const apis = [
        {
          url: `https://api.saveig.app/api/ajaxSearch`,
          method: 'POST',
          body: `q=${encodeURIComponent(url)}`,
        },
        {
          url: `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${encodeURIComponent(url)}`,
          method: 'GET',
        },
      ];

      for (const api of apis) {
        try {
          const response = await fetch(api.url, {
            method: api.method,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'Mozilla/5.0',
            },
            body: api.body,
          }).catch(() => null);

          if (response?.ok) {
            const data = await response.json();
            if (data.medias && data.medias.length > 0) {
              data.medias.forEach((media: any) => {
                if (media.url) {
                  links.push({
                    url: media.url,
                    quality: 'HD',
                    format: media.type === 'Video' ? 'mp4' : 'jpg',
                  });
                }
              });
              if (links.length > 0) break;
            }
          }
        } catch (e) {
          continue;
        }
      }
    }

    return links;
  } catch (error) {
    console.error('Extract error:', error);
    return [];
  }
}

function extractTikTokId(url: string): string | null {
  const regex = /\/video\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

