using System;
using System.Collections.Generic;

namespace TodoApp.Infrastructure.EFCoreGenerator;

/// <summary>
/// タスクステータスマスタ
/// </summary>
public partial class MTaskStatus
{
    /// <summary>
    /// Gets or sets iD
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets ステータス名（未着手, 進行中, 完了）
    /// </summary>
    public string StatusName { get; set; }

    /// <summary>
    /// Gets or sets 作成日時
    /// </summary>
    public DateTime? CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets 更新日時
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}
