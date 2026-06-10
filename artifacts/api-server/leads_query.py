#!/usr/bin/env python3
"""Read-only Supabase leads query: total leads + leads-to-first-close.
Reads DATABASE_URL from local .env. Prints aggregates only (no PII dumps,
no connection string)."""
import re, urllib.parse, ssl, sys
import pg8000.dbapi

env = open(".env").read()
m = re.search(r'DATABASE_URL\s*=\s*["\']?([^"\'\n]+)', env)
u = urllib.parse.urlparse(m.group(1))

conn = pg8000.dbapi.connect(
    user=urllib.parse.unquote(u.username),
    password=urllib.parse.unquote(u.password),
    host=u.hostname, port=u.port or 5432,
    database=(u.path or "/postgres").lstrip("/"),
    ssl_context=ssl.create_default_context(),
    timeout=25,
)
cur = conn.cursor()

def q(sql, args=None):
    cur.execute(sql, args or ())
    return cur.fetchall()

# columns
cols = [r[0] for r in q(
    "select column_name from information_schema.columns "
    "where table_schema='public' and table_name='leads' order by ordinal_position")]
print("LEADS COLUMNS:", ", ".join(cols))

total = q("select count(*) from leads")[0][0]
print("TOTAL LEADS:", total)

# date range
if "created_at" in cols:
    lo, hi = q("select min(created_at), max(created_at) from leads")[0]
    print("DATE RANGE:", lo, "->", hi)

# five9 status breakdown if present
if "five9_status" in cols:
    print("FIVE9_STATUS breakdown:")
    for status, c in q("select coalesce(five9_status,'(null)'), count(*) from leads group by 1 order by 2 desc"):
        print(f"   {c:5d}  {status}")

# locate the closed lead (Spex / Travis Spex) by name-ish columns
name_cols = [c for c in cols if any(k in c.lower() for k in ("name", "first", "last", "full"))]
spex_when = None
for c in name_cols:
    rows = q(f"select count(*) from leads where {c} ilike %s", ("%spex%",))
    if rows[0][0]:
        print(f"SPEX match in column '{c}': {rows[0][0]} row(s)")
        if "created_at" in cols:
            spex_when = q(f"select min(created_at) from leads where {c} ilike %s", ("%spex%",))[0][0]
if spex_when:
    before = q("select count(*) from leads where created_at <= %s", (spex_when,))[0][0]
    print("SPEX lead created_at:", spex_when)
    print("LEADS UP TO & INCLUDING SPEX:", before)
else:
    print("SPEX not found by name in leads table (sale may have come from a separately-loaded dialer list).")

conn.close()
