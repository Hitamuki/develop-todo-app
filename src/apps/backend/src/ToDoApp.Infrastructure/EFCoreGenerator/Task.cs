using System;
using System.Collections.Generic;

namespace TodoApp.Infrastructure.EFCoreGenerator;

/// <summary>
/// タスク
/// </summary>
public partial class Task
{
    /// <summary>
    /// UUID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// ユーザーID(users.id)
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// タイトル
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// 詳細
    /// </summary>
    public string Description { get; set; }

    /// <summary>
    /// 締切日
    /// </summary>
    public DateTime? DueDate { get; set; }

    /// <summary>
    /// ステータスID（m_task_statusのIDを参照）
    /// </summary>
    public int StatusId { get; set; }

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

    public virtual User CreatedByNavigation { get; set; }

    public virtual MTaskStatus Status { get; set; }

    public virtual User UpdatedByNavigation { get; set; }

    public virtual User User { get; set; }
}
