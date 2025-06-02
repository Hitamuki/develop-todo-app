using System;
using System.Collections.Generic;

namespace ToDoApp.Infrastructure.EFCoreGenerator;

/// <summary>
/// タスクステータスマスタ
/// </summary>
public partial class MTaskStatus
{
    /// <summary>
    /// ID
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// ステータス名（未着手, 進行中, 完了）
    /// </summary>
    public string StatusName { get; set; }

    /// <summary>
    /// 作成日時
    /// </summary>
    public DateTime? CreatedAt { get; set; }

    /// <summary>
    /// 更新日時
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}
