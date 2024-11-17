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
    'John Doe',
    'john.doe@example.com',
    FALSE,
    NULL,
    NULL
  ),
  (
    UUID (),
    'Jane Smith',
    'jane.smith@example.com',
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
        email = 'john.doe@example.com'
    ),
    'Buy groceries',
    'Buy milk, eggs, and bread',
    '2023-11-20',
    1,
    FALSE,
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'john.doe@example.com'
    ),
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'john.doe@example.com'
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
        email = 'jane.smith@example.com'
    ),
    'Complete project report',
    'Finish the report for project X',
    '2023-11-30',
    2,
    FALSE,
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'jane.smith@example.com'
    ),
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'jane.smith@example.com'
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
        email = 'john.doe@example.com'
    ),
    'Plan holiday',
    'Research destinations for holiday vacation',
    '2023-12-10',
    1,
    FALSE,
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'john.doe@example.com'
    ),
    (
      SELECT
        id
      FROM
        users
      WHERE
        email = 'jane.smith@example.com'
    )
  );