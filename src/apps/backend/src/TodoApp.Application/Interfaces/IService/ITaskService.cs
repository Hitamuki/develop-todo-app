using TodoApp.Domain.Entities;

namespace TodoApp.Application.Interfaces.IService;

public interface ITaskService
{
    /// <summary>
    /// すべてのタスクを取得する
    /// </summary>
    /// <returns>すべてのタスク</returns>
    Task<IEnumerable<TaskEntity>> SearchAsync();

    Task<TaskEntity> FindByIdAsync(Guid id);

    Task CreateAsync(TaskEntity entity);

    Task UpdateAsync(Guid id, TaskEntity entity);

    Task DeleteAsync(Guid id);
}
