using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace TodoApp.Infrastructure.DataSource;
public class MySqlDbContext : DbContext
{
  public MySqlDbContext(DbContextOptions<MySqlDbContext> options) : base(options)
  {
  }

  public DbSet<TaskEntity> Tasks { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);
    // カスタムモデル構成をここに追加
  }
}
