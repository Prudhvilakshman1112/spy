import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Chainable no-op query builder for when Supabase isn't configured
function noOpQueryBuilder() {
  const result = { data: [], error: null };
  const builder = {
    select: () => builder,
    eq: () => builder,
    neq: () => builder,
    in: () => builder,
    order: () => builder,
    limit: () => builder,
    single: () => ({ data: null, error: null }),
    then: (resolve) => resolve(result),
  };
  // Make it thenable so await works
  builder[Symbol.for('nodejs.util.inspect.custom')] = () => 'NoOpQueryBuilder';
  return builder;
}

function createNoOpClient() {
  return {
    from: () => noOpQueryBuilder(),
    auth: { getUser: async () => ({ data: { user: null } }) },
  };
}

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return a no-op client if credentials aren't configured
  if (!url || !key || url.includes('YOUR_NEW_PROJECT')) {
    return createNoOpClient();
  }

  const cookieStore = await cookies();

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );
}
