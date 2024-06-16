using Domain.Entities;

namespace TodoApp.Domain.Interfaces.IRepository;

public interface ITaskRepository
{
    Task<IEnumerable<TaskEntity>> GetAllAsync();
}