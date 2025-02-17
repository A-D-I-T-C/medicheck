ALTER TABLE "User" ADD COLUMN "role" varchar DEFAULT 'patient' NOT NULL;
ALTER TABLE "User" ADD COLUMN "name" varchar(64);

-- Update existing null values in the "name" column
UPDATE "User" SET "name" = 'test name' WHERE "name" IS NULL;

-- Alter the "name" column to be NOT NULL
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;