using Domain.Models;

namespace TodoApp.Domain.Repositories;

public interface ITaskRepository
{
    Task<IEnumerable<TaskEntity>> GetAllAsync();
}