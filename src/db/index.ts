import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export async function getUser({ name, pwd }: { name: string; pwd: string }) {
  const { data, error } = await supabase
    .rpc('login_user', {
      p_user_name: name,
      p_password: pwd,
    })
    .single();

  return { data, error };
}
