using Microsoft.Extensions.Logging;
using Org.OpenAPITools.Models;
using ToDoApp.Application.Interfaces.IService;
using ToDoApp.Domain.Entities;
using ToDoApp.Domain.Interfaces.IRepository;

namespace ToDoApp.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly ILogger<TaskService> _logger;

    public TaskService(
        ITaskRepository taskRepository,
        ILogger<TaskService> logger)
    {
        _taskRepository = taskRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<TaskGetResponseDto>> SearchAsync()
    {
        var tasks = await _taskRepository.SearchAsync();
        return tasks.Select(task => new TaskGetResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate ?? DateOnly.MinValue,
            StatusId = (StatusIdEnum)task.StatusId,
            CreatedAt = task.CreatedAt ?? DateTime.MinValue,
            UpdatedAt = task.UpdatedAt ?? DateTime.MinValue,
        });
    }

    public async Task<TaskGetResponseDto> FindByIdAsync(Guid id)
    {
        // TODO: ステータスはマスタテーブルの文字列で返す
        var task = await _taskRepository.FindByIdAsync(id);
        return new TaskGetResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            StatusId = (StatusIdEnum)task.StatusId,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
        };
    }

    public async Task CreateAsync(TaskPostRequestDto taskPostRequestDto)
    {
        // TODO: バリデーション
        var taskEntity = new TaskEntity
        {
            Id = Guid.NewGuid(),
            Title = taskPostRequestDto.Title,
            Description = taskPostRequestDto.Description,
            DueDate = taskPostRequestDto.DueDate,
            StatusId = (int)taskPostRequestDto.StatusId,
            UserId = Guid.Parse("ca62e350-b039-11ef-88cc-0242ac1a0002") // TODO: ユーザー情報DIで取得
        };

        await _taskRepository.CreateAsync(taskEntity);
    }

    public async Task UpdateAsync(Guid id, TaskPutRequestDto taskPutRequestDto)
    {
        // TODO: バリデーション
        // TODO: 更新ユーザー取得
        var taskEntity = new TaskEntity
        {
            Id = id,
            Title = taskPutRequestDto.Title,
            Description = taskPutRequestDto.Description,
            DueDate = taskPutRequestDto.DueDate,
            StatusId = (int)taskPutRequestDto.StatusId,
        };

        await _taskRepository.UpdateAsync(taskEntity);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _taskRepository.DeleteAsync(id);
    }
}
