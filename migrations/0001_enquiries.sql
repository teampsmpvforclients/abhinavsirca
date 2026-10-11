CREATE TABLE enquiries (
 id TEXT PRIMARY KEY,
 created_at TEXT NOT NULL,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 phone TEXT NOT NULL,
 course TEXT NOT NULL,
 message TEXT NOT NULL DEFAULT '',
 consent INTEGER NOT NULL CHECK(consent=1)
);
CREATE INDEX enquiries_created ON enquiries(created_at);
CREATE TABLE rate_limits (key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires INTEGER NOT NULL);
