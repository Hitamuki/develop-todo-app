using Microsoft.EntityFrameworkCore;
using ToDoApp.Application.Interfaces;
using ToDoApp.Domain.Entities;
using ToDoApp.Domain.Interfaces.IRepository;
using ToDoApp.Infrastructure.EFCoreGenerator;
using ToDoApp.Infrastructure.Mappers;

namespace ToDoApp.Infrastructure.DataSource.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly TodoContext _context;
    private readonly IUserContext _userContext;

    public TaskRepository(TodoContext context, IUserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    public async Task<IEnumerable<TaskEntity>> SearchAsync()
    {
        var tasks = await _context.Tasks
        .Where(t => t.UserId == Guid.Parse(_userContext.UserId) && t.IsDeleted == false)
        .ToListAsync();
        return tasks.Select(TaskMapper.ToEntity);
    }

    public async Task<TaskEntity> FindByIdAsync(Guid id)
    {
        var task = await _context.Tasks
        .FindAsync(id);
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
