namespace Domain.Entities;

public class TaskEntity
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
  public string Title { get; set; } // TODO: 文字数制限

  /// <summary>
  /// 詳細
  /// </summary>
  public string Description { get; set; } // TODO: 文字数制限

  /// <summary>
  /// 締切日
  /// </summary>
  public DateOnly? DueDate { get; set; }

  /// <summary>
  /// ステータスID（m_task_statusのIDを参照）
  /// </summary>
  public int StatusId { get; set; } // TODO: バリューオブジェクト

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
}