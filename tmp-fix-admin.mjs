import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY
const email = 'ozinpergam29@gmail.com'
const password = 'Ozin 1234'
const userId = 'd179d13c-a043-4620-a7ac-4861adef3a25'

if (!url || !serviceRoleKey || !anonKey) {
  throw new Error('Required backend environment variables are missing')
}

const admin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
})

const publicClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
})

const updateResult = await admin.auth.admin.updateUserById(userId, {
  password,
  email_confirm: true,
})
if (updateResult.error) throw updateResult.error

const roleResult = await admin
  .from('user_roles')
  .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' })
if (roleResult.error) throw roleResult.error

const signInResult = await publicClient.auth.signInWithPassword({ email, password })
if (signInResult.error) throw signInResult.error

console.log(JSON.stringify({
  ok: true,
  email,
  userId,
  hasSession: !!signInResult.data.session,
}))
