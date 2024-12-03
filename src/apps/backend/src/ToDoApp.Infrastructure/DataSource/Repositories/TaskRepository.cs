using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using TodoApp.Domain.Interfaces.IRepository;
using TodoApp.Infrastructure.EFCoreGenerator;
using TodoApp.Infrastructure.Mappers;

namespace TodoApp.Infrastructure.DataSource.Repositories;

public class TaskRepository : ITaskRepository
{
  private readonly TodoContext _context;

  public TaskRepository(TodoContext context)
  {
    _context = context;
  }

  public async Task<IEnumerable<TaskEntity>> GetAllAsync()
  {
    var tasks = await _context.Tasks.ToListAsync();
    return tasks.Select(TaskMapper.ToEntity);
  }

  public async Task<TaskEntity> GetByIdAsync(Guid id)
  {
    var task = await _context.Tasks.FindAsync(id);
    return task == null ? null : TaskMapper.ToEntity(task);
  }
}
