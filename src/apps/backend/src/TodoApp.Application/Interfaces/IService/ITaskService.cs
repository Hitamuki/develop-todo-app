using Domain.Entities;

namespace TodoApp.Application.Interfaces.IService;

public interface ITaskService{
    /// <summary>
    /// すべてのタスクを取得する
    /// </summary>
    /// <returns>すべてのタスク</returns>
    Task<IEnumerable<TaskEntity>> GetAllAsync();
}