# Authentication Setup

SwasthSetu AI now supports real backend authentication using Supabase Auth.

## What changed

The old login page only checked credentials against hard-coded demo users. That restriction has been removed.

Now the app supports:

- Email/password login
- Patient sign up
- Forgot password
- Logout
- Protected routes by role
- Supabase `auth_profiles` table
- Professional access application for doctors, PHC staff, managers and district admins

## Roles

| Role | Signup Flow | Portal |
|---|---|---|
| Patient | Direct signup | `/patient` |
| Doctor | Apply page + admin approval | `/doctor` |
| PHC Staff | Apply page + admin approval | `/phc` |
| PHC/CHC Manager | Apply page + admin approval | `/phc` |
| District Admin | Apply page + manual approval | `/dashboard` |

## Supabase setup

1. Create a Supabase project.
2. Go to Authentication → Providers → Email and enable Email auth.
3. Open SQL Editor.
4. Run `supabase/schema.sql`.
5. Add environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

## Creating doctor/staff/admin accounts

Patients can create accounts themselves.

For Doctor, Staff, Manager and Admin:

1. User submits the `/apply` form.
2. Admin verifies licence/hospital details.
3. Admin creates user in Supabase Auth.
4. Admin inserts/updates row in `auth_profiles` with the correct role.

Example SQL:

```sql
update auth_profiles
set role = 'doctor', centre = 'wakad'
where email = 'doctor@swasthsetu.in';
```

## Demo login section

The demo section remains visible for presentations. It fills test credentials only. Real login still goes through Supabase Auth, so those accounts must exist in Supabase before they can log in.
