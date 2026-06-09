export const config = { runtime: 'edge' };

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';

async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  const basic = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN! }),
  });
  return res.json();
}

export default async function handler() {
  try {
    const { access_token } = await getAccessToken();
    const res = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (res.status === 204 || res.status > 400) {
      return new Response(JSON.stringify({ isPlaying: false }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    const data = await res.json();
    const isPlaying = data.is_playing;
    const title = data.item?.name ?? '';
    const artist = data.item?.artists?.map((a: any) => a.name).join(', ') ?? '';
    const albumImage = data.item?.album?.images?.[1]?.url ?? data.item?.album?.images?.[0]?.url ?? '';
    const songUrl = data.item?.external_urls?.spotify ?? '';

    return new Response(JSON.stringify({ isPlaying, title, artist, albumImage, songUrl }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch {
    return new Response(JSON.stringify({ isPlaying: false }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}