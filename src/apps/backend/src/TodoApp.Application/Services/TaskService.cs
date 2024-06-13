using Domain.Models;
using Microsoft.Extensions.Logging;
using TodoApp.Application.Interfaces;
using TodoApp.Domain.Repositories;

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