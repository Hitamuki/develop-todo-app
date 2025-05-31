using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace TodoApp.Infrastructure.EFCoreGenerator;

public partial class TodoContext : DbContext
{
    public TodoContext()
    {
    }

    public TodoContext(DbContextOptions<TodoContext> options)
        : base(options)
    {
    }

    public virtual DbSet<MTaskStatus> MTaskStatuses { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=127.0.0.1;port=3306;database=todo;user=user;password=password", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.40-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_general_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<MTaskStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("m_task_status", tb => tb.HasComment("タスクステータスマスタ"))
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.Id)
                .HasComment("ID")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasComment("作成日時")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.StatusName)
                .IsRequired()
                .HasMaxLength(50)
                .HasComment("ステータス名（未着手, 進行中, 完了）")
                .HasColumnName("status_name");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasComment("更新日時")
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("tasks", tb => tb.HasComment("タスク"))
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.CreatedBy, "fk_tasks_created_by");

            entity.HasIndex(e => e.StatusId, "fk_tasks_status_id");

            entity.HasIndex(e => e.UpdatedBy, "fk_tasks_updated_by");

            entity.HasIndex(e => e.UserId, "fk_tasks_user_id");

            entity.Property(e => e.Id)
                .HasComment("UUID")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasComment("登録日時")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy)
                .HasComment("登録ユーザー")
                .HasColumnName("created_by");
            entity.Property(e => e.Description)
                .HasComment("詳細")
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.DueDate)
                .HasComment("締切日")
                .HasColumnName("due_date");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValueSql("'0'")
                .HasComment("論理削除フラグ")
                .HasColumnName("is_deleted");
            entity.Property(e => e.StatusId)
                .HasComment("ステータスID（m_task_statusのIDを参照）")
                .HasColumnName("status_id");
            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(100)
                .HasComment("タイトル")
                .HasColumnName("title");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasComment("更新日時")
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");
            entity.Property(e => e.UpdatedBy)
                .HasComment("更新ユーザー")
                .HasColumnName("updated_by");
            entity.Property(e => e.UserId)
                .HasComment("ユーザーID(users.id)")
                .HasColumnName("user_id");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.TaskCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_tasks_created_by");

            entity.HasOne(d => d.Status).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.StatusId)
                .HasConstraintName("fk_tasks_status_id");

            entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.TaskUpdatedByNavigations)
                .HasForeignKey(d => d.UpdatedBy)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_tasks_updated_by");

            entity.HasOne(d => d.User).WithMany(p => p.TaskUsers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("fk_tasks_user_id");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity
                .ToTable("users", tb => tb.HasComment("ユーザー"))
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.CreatedBy, "fk_users_created_by");

            entity.HasIndex(e => e.UpdatedBy, "fk_users_updated_by");

            entity.Property(e => e.Id)
                .HasComment("UUID")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasComment("登録日時")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy)
                .HasComment("登録ユーザー")
                .HasColumnName("created_by");
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(100)
                .HasComment("メールアドレス")
                .HasColumnName("email");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValueSql("'0'")
                .HasComment("論理削除フラグ")
                .HasColumnName("is_deleted");
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50)
                .HasComment("ユーザー名")
                .HasColumnName("name");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasComment("更新日時")
                .HasColumnType("timestamp")
                .HasColumnName("updated_at");
            entity.Property(e => e.UpdatedBy)
                .HasComment("更新ユーザー")
                .HasColumnName("updated_by");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
