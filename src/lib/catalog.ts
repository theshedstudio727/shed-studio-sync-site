// Fetches the real sync-licensing catalog from Supabase at build time.
// Uses the publishable key only (RLS restricts reads to license_status != 'withheld' —
// see projects/youtube-content-agent/sql/001_songs_catalog.sql), never the secret key.
//
// NOTE: assumes the "songs" storage bucket is public (standard Supabase
// /storage/v1/object/public/{bucket}/{path} URL pattern). Unverified as of
// 2026-08-18 — the catalog table was empty at build time, so this couldn't
// be tested against a real file yet. Confirm once real rows exist.

export interface CatalogTrack {
  id: string;
  title: string;
  styleTags: string[];
  durationSeconds: number | null;
  audioUrl: string;
}

export interface CuratedTrack {
  title: string;
  tags: string[];
  youtubeId: string;
  vertical?: boolean;
  releasedAt: string;
}

// The full set of published Retro Rewind tracks, verified embeddable
// (checked via YouTube's oEmbed endpoint) 2026-08-18. Deliberately
// excludes 6 other published videos: 3 name a real artist directly
// (Fleetwood Mac / Daft Punk / Gorillaz "Era" titles) which violates the
// standing never-name-a-specific-artist guardrail (see
// workflows/daily_script_pipeline.md in youtube-content-agent) and is a
// real risk to show on a page pitching "license our original music"; 3
// more are covers/remixes of existing songs, not original compositions,
// so they don't belong on an "original, licensable" catalog either.
// No bpm/key listed - can't verify without actually analyzing the audio,
// and inventing plausible-sounding numbers on a page music supervisors
// use for real editing decisions isn't something to fake.
//
// `releasedAt` is each video's real YouTube publish date (pulled from the
// public watch page's `publishDate` field, 2026-08-18) - used to drive the
// "new releases" surfacing, not a made-up value.
export const curatedTracks: CuratedTrack[] = [
  { title: '2000s Neo-Soul, Reworked as Melodic Techno', tags: ['Neo-Soul', 'Techno', '2000s'], youtubeId: 'O0jXZ6HIFI0', vertical: true, releasedAt: '2026-08-16' },
  { title: '60s Southern Soul, Reworked as Drum & Bass', tags: ['Soul', 'Drum & Bass', '60s'], youtubeId: 'X3KI97TyQcs', vertical: true, releasedAt: '2026-08-16' },
  { title: '70s Philly Soul, Reworked as Deep House', tags: ['Soul', 'Deep House', '70s'], youtubeId: '7hLFu-iIHho', vertical: true, releasedAt: '2026-08-16' },
  { title: 'Hát Bội Opera, Reimagined as Trap', tags: ['Vietnamese', 'Trap', 'Traditional'], youtubeId: 'KN9TY3cjgdI', vertical: true, releasedAt: '2026-08-14' },
  { title: 'Hò Sông River Work Songs, Reimagined as Boom-Bap Hip-Hop', tags: ['Vietnamese', 'Hip-Hop', 'Traditional'], youtubeId: 'CA1S1jO_dxo', vertical: true, releasedAt: '2026-08-14' },
  { title: 'Vọng Cổ Ballads, Reimagined as Modern R&B', tags: ['Vietnamese', 'R&B', 'Ballad'], youtubeId: 'Rxi2BsirMS4', vertical: true, releasedAt: '2026-08-14' },
  { title: 'Hát Xẩm Street Ballads, Reimagined as Boom-Bap Hip-Hop', tags: ['Vietnamese', 'Hip-Hop', 'Traditional'], youtubeId: 'BRDy1atELZ4', vertical: true, releasedAt: '2026-08-12' },
  { title: 'Quan Họ Folk Singing, Reimagined as Modern R&B', tags: ['Vietnamese', 'R&B', 'Folk'], youtubeId: 'GditsRA95SI', vertical: true, releasedAt: '2026-08-12' },
  { title: 'Imperial Hue Court Music, Reimagined as Trap', tags: ['Vietnamese', 'Trap', 'Traditional'], youtubeId: 'Y8-_LF-GMCQ', vertical: true, releasedAt: '2026-08-12' },
  { title: 'An Ancient Vietnamese Ca Trù Chamber Piece', tags: ['Vietnamese', 'Chamber', 'Traditional'], youtubeId: 'FiliZ9hy7NI', vertical: true, releasedAt: '2026-08-12' },
  { title: 'A Golden-Era 1960s Vietnamese Bolero Ballad', tags: ['Vietnamese', 'Bolero', '60s'], youtubeId: 'xZuuM4yk5WY', vertical: true, releasedAt: '2026-08-12' },
  { title: 'A Lost 70s Laurel Canyon Folk-Rock Harmony Song', tags: ['Folk-Rock', '70s', 'Harmony'], youtubeId: 'aAUDy66_pRQ', vertical: true, releasedAt: '2026-08-11' },
  { title: 'A Lost 60s Motown-Style Soul Single', tags: ['Soul', 'Motown', '60s'], youtubeId: 'AMVpxGMsO08', vertical: true, releasedAt: '2026-08-11' },
  { title: 'A Lost 80s Japanese City Pop Night Drive Anthem', tags: ['City Pop', '80s', 'Nocturnal'], youtubeId: 'x0AAfaj-AL0', vertical: true, releasedAt: '2026-08-11' },
  { title: 'A 90s Grunge Ballad, Built From Scratch', tags: ['Grunge', '90s', 'Ballad'], youtubeId: 'XMERQpyOki8', vertical: true, releasedAt: '2026-08-11' },
  { title: 'A Golden-Era 90s Bollywood-Style Romantic Ballad', tags: ['Bollywood', '90s', 'Romantic'], youtubeId: 'ECM_1ft5g8M', vertical: true, releasedAt: '2026-08-11' },
  { title: 'A Lost 80s New Wave Synth-Pop Anthem', tags: ['Synth-Pop', '80s', 'New Wave'], youtubeId: 'YkDrm9qbMUg', vertical: true, releasedAt: '2026-08-11' },
  { title: 'A 90s R&B Slow Jam, Built From Scratch', tags: ['R&B', '90s', 'Slow Jam'], youtubeId: 'XZug3oqT0zA', vertical: true, releasedAt: '2026-08-11' },
  { title: 'The Golden Era of Sultry 70s-80s Soul & R&B', tags: ['Soul', 'R&B', '70s-80s'], youtubeId: 'mq3febWho6w', vertical: true, releasedAt: '2026-08-10' },
  { title: 'A Lost 80s Italo Disco Anthem', tags: ['Disco', '80s', 'Euphoric'], youtubeId: 'ITejVPeBs_s', vertical: true, releasedAt: '2026-08-10' },
];

export function sortByNewest(tracks: CuratedTrack[]): CuratedTrack[] {
  return [...tracks].sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
}

export async function fetchCatalog(): Promise<CatalogTrack[]> {
  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];

  try {
    const resp = await fetch(
      `${url.replace(/\/$/, '')}/rest/v1/songs?select=*&order=generated_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!resp.ok) return [];
    const rows = await resp.json();
    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      styleTags: (r.style_tags ?? '')
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean),
      durationSeconds: r.duration_seconds,
      audioUrl: `${url.replace(/\/$/, '')}/storage/v1/object/public/songs/${r.audio_path}`,
    }));
  } catch {
    return [];
  }
}
