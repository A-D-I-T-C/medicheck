ALTER TABLE "User" ADD COLUMN "role" varchar DEFAULT 'patient' NOT NULL;
ALTER TABLE "User" ADD COLUMN "name" varchar(64);

