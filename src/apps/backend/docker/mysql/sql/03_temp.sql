-- usersテーブルへのデータ挿入
INSERT INTO
  users (
    id,
    name,
    email,
    is_deleted,
    created_by,
    updated_by
  )
VALUES
  (
    UUID (),
    'くま',
    'kuma1@example.com',
    FALSE,
    NULL,
    NULL
  ),
  (
    UUID (),
    'くま2',
    'kuma2@example.com',
    FALSE,
    NULL,
    NULL
  ),
  (
    'ca62e350-b039-11ef-88cc-0242ac1a0002',
    'くま様',
    'kuma-adimin@example.com',
    FALSE,
    NULL,
    NULL
  );

-- tasksテーブルへのデータ挿入
INSERT INTO
  tasks (
    id,
    user_id,
    title,
    description,
    due_date,
    status_id,
    is_deleted,
    created_by,
    updated_by
  )
VALUES
  (
    UUID (),
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'kuma1@example.com'
    ),
    '検証環境としてデプロイ',
    'Vercel、Fly.io',
    NULL,
    1,
    FALSE,
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'kuma1@example.com'
    ),
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'kuma1@example.com'
    )
  ),
  (
    UUID (),
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'kuma2@example.com'
    ),
    'クリーンアーキテクチャの構成見直し',
    'DTO、Entity、Value Object',
    '2025-1-1',
    2,
    FALSE,
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'kuma2@example.com'
    ),
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'kuma2@example.com'
    )
  ),
  (
    UUID (),
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'kuma1@example.com'
    ),
    'テスト導入',
    'xUnit、Jest、Testing Library、Cypress',
    '2024-12-17',
    1,
    FALSE,
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'kuma1@example.com'
    ),
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'kuma2@example.com'
    )
  );
