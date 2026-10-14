# Rollback scripts — DESTRUCTIVE

Scripts in this directory **drop objects and data**. They are kept out of
`supabase/migrations/` deliberately.

## Why they are not in `supabase/migrations/`

The Supabase CLI applies **every** file in `supabase/migrations/` in
filename order via `supabase db push`. A rollback script stored there would be
applied as if it were a forward migration, destroying the schema. The CLI has
no concept of "down" migrations, so rollbacks must live elsewhere and be run
manually by a human.

A test (`lib/supabase/schema.test.ts`) enforces that no file in
`supabase/migrations/` contains destructive drop statements.

## Contents

| Script | Reverses | Notes |
| --- | --- | --- |
| `rollback_0001_init.sql` | `migrations/20261011235451_init.sql` | Drops all 8 Stage B tables, 3 enum types, 5 functions, 9 triggers, 30 RLS policies, and the `profiles` column grants. |

## How to run one

Only on a disposable dev/test instance, never against production:

```bash
psql "$DB_URL" -f supabase/rollback/rollback_0001_init.sql
```

Run it yourself; do not wire it into any deploy, CI job, or `db push`.
