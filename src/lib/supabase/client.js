import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('YOUR_NEW_PROJECT')) {
    // Return a minimal no-op client when credentials aren't configured
    return {
      from: () => ({
        select: () => ({ data: [], error: null, eq: () => ({ data: [], error: null, in: () => ({ data: [], error: null }) }) }),
      }),
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    };
  }

  return createBrowserClient(url, key);
}
