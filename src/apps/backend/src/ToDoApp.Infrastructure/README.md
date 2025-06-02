# メモ

## コマンド

- src/apps/backend/src/ToDoApp.Infrastructureで実行

``` bash
dotnet ef dbcontext scaffold "Server=127.0.0.1;port=3306;Database=todo;User=user;Password=password;" Pomelo.EntityFrameworkCore.MySql -o EFCoreGenerator -f
```
