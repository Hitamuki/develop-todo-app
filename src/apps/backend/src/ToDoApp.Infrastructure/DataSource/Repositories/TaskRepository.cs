using Domain.Interfaces;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using TodoApp.Domain.Repositories;

namespace TodoApp.Infrastructure.DataSource.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly IDatabaseConnection _databaseConnection;
    private readonly MySqlDbContext _context;

    public TaskRepository(
        IDatabaseConnection databaseConnection,
        MySqlDbContext context)
    {
        _databaseConnection = databaseConnection;
        _context = context;
    }

    public async Task<IEnumerable<TaskEntity>> GetAllAsync()
    {
        return await _context.Tasks.ToListAsync();
    }
}
