using Domain.Entities;
using Microsoft.Extensions.Logging;
using TodoApp.Application.Interfaces.IService;
using TodoApp.Domain.Interfaces.IRepository;

namespace TodoApp.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly ILogger<TaskService> _logger;

    public TaskService(
        ITaskRepository todoRepository,
        ILogger<TaskService> logger)
    {
        _taskRepository = todoRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<TaskEntity>> GetAllAsync()
    {
        return await _taskRepository.GetAllAsync();
    }
}