using Domain.Models;

namespace TodoApp.Application.Interfaces;

public interface ITaskService{
    /// <summary>
    /// すべてのタスクを取得する
    /// </summary>
    /// <returns>すべてのタスク</returns>
    Task<IEnumerable<TaskEntity>> GetAllAsync();
}