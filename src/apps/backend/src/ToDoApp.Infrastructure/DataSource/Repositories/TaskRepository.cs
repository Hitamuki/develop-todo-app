using Microsoft.EntityFrameworkCore;
using ToDoApp.Domain.Entities;
using ToDoApp.Domain.Interfaces.IRepository;
using ToDoApp.Infrastructure.EFCoreGenerator;
using ToDoApp.Infrastructure.Mappers;

namespace ToDoApp.Infrastructure.DataSource.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly TodoContext _context;

    public TaskRepository(TodoContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskEntity>> SearchAsync()
    {
        var tasks = await _context.Tasks.ToListAsync();
        return tasks.Select(TaskMapper.ToEntity);
    }

    public async Task<TaskEntity> FindByIdAsync(Guid id)
    {
        var task = await _context.Tasks.FindAsync(id);
        return task == null ? null : TaskMapper.ToEntity(task);
    }

    public async System.Threading.Tasks.Task CreateAsync(TaskEntity entity)
    {
        await _context.Tasks.AddAsync(TaskMapper.ToEfCore(entity));
        await _context.SaveChangesAsync();
    }

    public async System.Threading.Tasks.Task UpdateAsync(TaskEntity entity)
    {
        var task = await _context.Tasks.FindAsync(entity.Id);
        task.Title = entity.Title;
        task.Description = entity.Description;
        task.DueDate = entity.DueDate;
        task.StatusId = entity.StatusId;

        await _context.SaveChangesAsync();
    }

    public async System.Threading.Tasks.Task DeleteAsync(Guid id)
    {
        var task = await _context.Tasks.FindAsync(id);
        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
    }
}
