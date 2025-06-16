using ToDoApp.Domain.Entities;

namespace ToDoApp.Domain.Interfaces.IRepository;

public interface ITaskRepository
{
    Task<IEnumerable<TaskEntity>> SearchAsync();

    Task<TaskEntity> FindByIdAsync(Guid id);

    Task CreateAsync(TaskEntity entity);

    Task UpdateAsync(TaskEntity entity);

    Task DeleteAsync(Guid id);
}
