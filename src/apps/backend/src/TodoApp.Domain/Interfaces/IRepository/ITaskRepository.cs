using Domain.Entities;

namespace TodoApp.Domain.Interfaces.IRepository;

public interface ITaskRepository
{
    Task<IEnumerable<TaskEntity>> SearchAsync();

    Task<TaskEntity> FindByIdAsync(Guid id);

    Task CreateAsync(TaskEntity entity);

    Task UpdateAsync(Guid id, TaskEntity entity);

    Task DeleteAsync(Guid id);
}
