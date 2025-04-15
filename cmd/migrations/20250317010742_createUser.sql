-- +goose Up
-- +goose StatementBegin
CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "public";
CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "public";
CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "public";

CREATE TYPE "organization_type_enum" AS ENUM ('airline', 'carrier', 'warehouse');

-- Organization Table
CREATE TABLE IF NOT EXISTS "organizations" (
    "id" UUID PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "name" TEXT NOT NULL,
    "unique_url" CITEXT UNIQUE,
    "formatted_address" TEXT NOT NULL,
    "address" JSONB,
    "contact_info" TEXT NOT NULL,
    "organization_type" "organization_type_enum" NOT NULL,
    "logo_url" TEXT NOT NULL,
    "scac" VARCHAR(4) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE

);

-- User Table
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "user_name" CITEXT UNIQUE,
    "email" CITEXT UNIQUE,
    "hashed_password" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT FALSE,
    "is_verified" BOOLEAN NOT NULL DEFAULT FALSE,
    "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "last_request" TIMESTAMPTZ NOT NULL,
    "last_login" TIMESTAMPTZ NOT NULL,
    "failed_login_attempts" INT NOT NULL DEFAULT 0
);

CREATE TYPE "organization_status" AS ENUM ('pending', 'active', 'inactive');

CREATE TYPE "permissions_enum" AS ENUM (
    'organization.write'
);

-- User Associations Table
CREATE TABLE IF NOT EXISTS "user_associations" (
    "id" UUID PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "status" "organization_status" NOT NULL,
    "permissions" "permissions_enum"[],
    "user_id" UUID NOT NULL, -- FK user
    "organization_id" UUID NOT NULL, -- FK organization
    
    CONSTRAINT "unique_user_org" UNIQUE ("user_id", "organization_id")
);

ALTER TABLE "user_associations" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_associations" ADD CONSTRAINT "fk_user_association_organization" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP EXTENSION IF EXISTS "citext" CASCADE;
DROP EXTENSION IF EXISTS "pg_trgm" CASCADE;
DROP EXTENSION IF EXISTS "postgis" CASCADE;

DROP TABLE IF EXISTS "user_associations";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "organizations";

DROP TYPE IF EXISTS "permissions_enum";
DROP TYPE IF EXISTS "organization_type_enum";
DROP TYPE IF EXISTS "organization_status";
-- +goose StatementEnd
