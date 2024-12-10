using Domain.Entities;
using Microsoft.Extensions.Logging;
using TodoApp.Application.Interfaces.IService;
using TodoApp.Domain.Interfaces.IRepository;

namespace TodoApp.Application.Services;

public class TaskService : ITaskService
{
  private readonly ITaskRepository _taskRepository;
  private readonly ILogger<TaskService> _logger;

  public TaskService(
      ITaskRepository taskRepository,
      ILogger<TaskService> logger)
  {
    _taskRepository = taskRepository;
    _logger = logger;
  }

  public async Task<IEnumerable<TaskEntity>> SearchAsync()
  {
    // TODO: サービスクラスでEntityからDTOに変換
    return await _taskRepository.SearchAsync();
  }

  public async Task<TaskEntity> FindByIdAsync(Guid id)
  {
    // TODO: ステータスはマスタテーブルの文字列で返す
    return await _taskRepository.FindByIdAsync(id);
  }

  public async Task CreateAsync(TaskEntity entity)
  {
    entity.Id = Guid.NewGuid();
    entity.UserId = Guid.Parse("ca62e350-b039-11ef-88cc-0242ac1a0002"); // TODO: 暫定
    await _taskRepository.CreateAsync(entity);
  }

  public async Task UpdateAsync(Guid id, TaskEntity entity)
  {
    // TODO: 更新ユーザー取得
    await _taskRepository.UpdateAsync(id, entity);
  }

  public async Task DeleteAsync(Guid id)
  {
    await _taskRepository.DeleteAsync(id);
  }

}