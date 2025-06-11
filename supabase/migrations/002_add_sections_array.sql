-- セクションを順序付き配列として保存するためのカラムを追加
ALTER TABLE chat_sessions 
ADD COLUMN sections JSONB NOT NULL DEFAULT '[]'::jsonb;

-- セクション検索用のインデックス追加
CREATE INDEX idx_chat_sessions_sections ON chat_sessions USING GIN (sections);

-- 既存データの移行は後で手動実行（必要に応じて）
-- UPDATE chat_sessions SET sections = '[]'::jsonb WHERE sections IS NULL;