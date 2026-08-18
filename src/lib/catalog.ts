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
