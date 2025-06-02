using System;
using System.Collections.Generic;

namespace ToDoApp.Infrastructure.EFCoreGenerator;

/// <summary>
/// ユーザー
/// </summary>
public partial class User
{
    /// <summary>
    /// UUID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// ユーザー名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// メールアドレス
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// ハッシュ化済パスワード
    /// </summary>
    public string PasswordHash { get; set; }

    /// <summary>
    /// 論理削除フラグ
    /// </summary>
    public bool? IsDeleted { get; set; }

    /// <summary>
    /// 登録日時
    /// </summary>
    public DateTime? CreatedAt { get; set; }

    /// <summary>
    /// 登録ユーザー
    /// </summary>
    public Guid? CreatedBy { get; set; }

    /// <summary>
    /// 更新日時
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// 更新ユーザー
    /// </summary>
    public Guid? UpdatedBy { get; set; }

    public virtual ICollection<Task> TaskCreatedByNavigations { get; set; } = new List<Task>();

    public virtual ICollection<Task> TaskUpdatedByNavigations { get; set; } = new List<Task>();

    public virtual ICollection<Task> TaskUsers { get; set; } = new List<Task>();
}
