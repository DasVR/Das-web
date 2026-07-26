#!/usr/bin/env bash
# Run the RLS regression suite against a throwaway local Postgres.
#
# Supabase supplies auth.uid(), auth.users, the storage schema, and the
# anon/authenticated roles. Those are stubbed here (see auth_stub.sql) so the
# policies can be exercised without a Supabase project.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATIONS="$HERE/../migrations"
PGDATA="${PGDATA:-/tmp/dasdev-pgtest/data}"
PGPORT="${PGPORT:-55432}"
PGBIN="${PGBIN:-/usr/lib/postgresql/16/bin}"
DB=dasdev_test

export PGHOST=/tmp/dasdev-pgtest
export PGPORT

cleanup() {
  "$PGBIN/pg_ctl" -D "$PGDATA" -s -m immediate stop >/dev/null 2>&1 || true
}
trap cleanup EXIT

rm -rf /tmp/dasdev-pgtest
mkdir -p "$PGDATA" "$PGHOST"

"$PGBIN/initdb" -D "$PGDATA" -U postgres --auth=trust >/dev/null
"$PGBIN/pg_ctl" -D "$PGDATA" -o "-k $PGHOST -p $PGPORT -c listen_addresses=''" -l /tmp/dasdev-pgtest/pg.log -w start >/dev/null

psql -U postgres -q -c "create database $DB" postgres

run() {
  psql -U postgres -v ON_ERROR_STOP=1 -q -f "$1" "$DB"
}

echo "Applying auth stub..."
run "$HERE/auth_stub.sql"

for migration in "$MIGRATIONS"/*.sql; do
  echo "Applying $(basename "$migration")..."
  run "$migration"
done

echo ""
echo "Running RLS assertions..."

# The suite seeds committed rows, so it is only runnable once per database.
# Capture psql's status through PIPESTATUS rather than re-running it.
set +e
psql -U postgres -v ON_ERROR_STOP=1 -f "$HERE/rls_test.sql" "$DB" 2>&1 \
  | grep -E "pass:|FAIL|All RLS|ERROR"
status=${PIPESTATUS[0]}
set -e

passed=$(psql -U postgres -tAc "select 1" "$DB" >/dev/null 2>&1 && echo yes || echo no)

echo ""
if [ "$status" -eq 0 ] && [ "$passed" = "yes" ]; then
  echo "RLS suite: PASS"
else
  echo "RLS suite: FAIL"
  exit 1
fi
