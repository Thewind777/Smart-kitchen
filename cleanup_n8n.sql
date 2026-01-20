-- 🚨 DESTRUCTIVE SCRIPT: DROPS ALL N8N TABLES
-- Run this in Supabase SQL Editor to free up space and clean the schema.

-- 1. Drop Legacy/n8n Tables (Use CASCADE to handle foreign keys)
DROP TABLE IF EXISTS "annotation_tag_entity" CASCADE;
DROP TABLE IF EXISTS "auth_identity" CASCADE;
DROP TABLE IF EXISTS "auth_provider_sync_history" CASCADE;
DROP TABLE IF EXISTS "binary_data" CASCADE;
DROP TABLE IF EXISTS "chat_hub_agents" CASCADE;
DROP TABLE IF EXISTS "chat_hub_messages" CASCADE;
DROP TABLE IF EXISTS "chat_hub_sessions" CASCADE;
DROP TABLE IF EXISTS "credentials_entity" CASCADE;
DROP TABLE IF EXISTS "data_table" CASCADE;
DROP TABLE IF EXISTS "data_table_column" CASCADE;
DROP TABLE IF EXISTS "dynamic_credential_entry" CASCADE;
DROP TABLE IF EXISTS "dynamic_credential_resolver" CASCADE;
DROP TABLE IF EXISTS "event_destinations" CASCADE;
DROP TABLE IF EXISTS "execution_annotation_tags" CASCADE;
DROP TABLE IF EXISTS "execution_annotations" CASCADE;
DROP TABLE IF EXISTS "execution_data" CASCADE;
DROP TABLE IF EXISTS "execution_entity" CASCADE;
DROP TABLE IF EXISTS "execution_metadata" CASCADE;
DROP TABLE IF EXISTS "folder" CASCADE;
DROP TABLE IF EXISTS "folder_tag" CASCADE;
DROP TABLE IF EXISTS "insights_by_period" CASCADE;
DROP TABLE IF EXISTS "insights_metadata" CASCADE;
DROP TABLE IF EXISTS "insights_raw" CASCADE;
DROP TABLE IF EXISTS "installed_nodes" CASCADE;
DROP TABLE IF EXISTS "installed_packages" CASCADE;
DROP TABLE IF EXISTS "invalid_auth_token" CASCADE;
DROP TABLE IF EXISTS "migrations" CASCADE;
DROP TABLE IF EXISTS "oauth_access_tokens" CASCADE;
DROP TABLE IF EXISTS "oauth_authorization_codes" CASCADE;
DROP TABLE IF EXISTS "oauth_clients" CASCADE;
DROP TABLE IF EXISTS "oauth_refresh_tokens" CASCADE;
DROP TABLE IF EXISTS "oauth_user_consents" CASCADE;
DROP TABLE IF EXISTS "processed_data" CASCADE;
DROP TABLE IF EXISTS "project" CASCADE;
DROP TABLE IF EXISTS "project_relation" CASCADE;
DROP TABLE IF EXISTS "role" CASCADE;
DROP TABLE IF EXISTS "role_scope" CASCADE;
DROP TABLE IF EXISTS "scope" CASCADE;
DROP TABLE IF EXISTS "settings" CASCADE;
DROP TABLE IF EXISTS "shared_credentials" CASCADE;
DROP TABLE IF EXISTS "shared_workflow" CASCADE;
DROP TABLE IF EXISTS "tag_entity" CASCADE;
DROP TABLE IF EXISTS "test_case_execution" CASCADE;
DROP TABLE IF EXISTS "test_run" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE; -- Careful: this is public.user (n8n), not auth.users (Supabase)
DROP TABLE IF EXISTS "user_api_keys" CASCADE;
DROP TABLE IF EXISTS "variables" CASCADE;
DROP TABLE IF EXISTS "webhook_entity" CASCADE;
DROP TABLE IF EXISTS "workflow_dependency" CASCADE;
DROP TABLE IF EXISTS "workflow_entity" CASCADE;
DROP TABLE IF EXISTS "workflow_history" CASCADE;
DROP TABLE IF EXISTS "workflow_publish_history" CASCADE;
DROP TABLE IF EXISTS "workflow_statistics" CASCADE;
DROP TABLE IF EXISTS "workflows_tags" CASCADE;

-- 2. Verify we kept the Ruby Cassini tables
-- Do NOT drop: products, recipes, recipe_ingredients
