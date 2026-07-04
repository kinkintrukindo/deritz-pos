-- product_id and order_id were incorrectly typed as uuid, but this app's
-- product and order IDs are slugs (e.g. "look-01") and human-readable codes
-- (e.g. "DR-00001"), not UUIDs. Every conversation tied to a product or
-- order was silently failing to insert. Fix the column types to text.
ALTER TABLE public.chat_conversations
  ALTER COLUMN product_id TYPE text,
  ALTER COLUMN order_id TYPE text;
