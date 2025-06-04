namespace TodoApp.Domain.Entities;

public class TaskEntity
{
    /// <summary>
    /// Gets or sets uUID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Gets or sets ユーザーID(users.id)
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Gets or sets タイトル
    /// </summary>
    public string Title { get; set; } // TODO: 文字数制限

    /// <summary>
    /// Gets or sets 詳細
    /// </summary>
    public string Description { get; set; } // TODO: 文字数制限

    /// <summary>
    /// Gets or sets 締切日
    /// </summary>
    public DateOnly? DueDate { get; set; }

    /// <summary>
    /// Gets or sets ステータスID（m_task_statusのIDを参照）
    /// </summary>
    public int StatusId { get; set; } // TODO: バリューオブジェクト

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
}
