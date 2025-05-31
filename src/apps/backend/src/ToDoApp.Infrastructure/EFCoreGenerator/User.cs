using System;
using System.Collections.Generic;

namespace TodoApp.Infrastructure.EFCoreGenerator;

/// <summary>
/// ユーザー
/// </summary>
public partial class User
{
    /// <summary>
    /// Gets or sets uUID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Gets or sets ユーザー名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Gets or sets メールアドレス
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// Gets or sets 論理削除フラグ
    /// </summary>
    public bool? IsDeleted { get; set; }

    /// <summary>
    /// Gets or sets 登録日時
    /// </summary>
    public DateTime? CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets 登録ユーザー
    /// </summary>
    public Guid? CreatedBy { get; set; }

    /// <summary>
    /// Gets or sets 更新日時
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// Gets or sets 更新ユーザー
    /// </summary>
    public Guid? UpdatedBy { get; set; }

    public virtual ICollection<Task> TaskCreatedByNavigations { get; set; } = new List<Task>();

    public virtual ICollection<Task> TaskUpdatedByNavigations { get; set; } = new List<Task>();

    public virtual ICollection<Task> TaskUsers { get; set; } = new List<Task>();
}
