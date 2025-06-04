using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Org.OpenAPITools.Controllers;
using TodoApp.Domain.Entities;
using Org.OpenAPITools.Models;
using TodoApp.Application.Interfaces.IService;

namespace ToDoApp.Presentation.Controllers;

[ApiController]
[Route("[controller]")]
public class TasksController : TasksApiController
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    /// <inheritdoc/>
    public override async Task<IActionResult> GetTasks()
    {
        // TODO: クエリパラメータから検索
        IEnumerable<TaskEntity> tasks = await _taskService.SearchAsync();

        // TODO: サービスクラスでEntityからDTOに変換
        // TODO: サービスクラスのDTOとOpenAPIのDTOをマッピング
        var taskGetResponseDtos = tasks.Select(task => new TaskGetResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate ?? DateOnly.MinValue,
            StatusId = (StatusIdEnum)task.StatusId,
            CreatedAt = task.CreatedAt ?? DateTime.MinValue,
            UpdatedAt = task.UpdatedAt ?? DateTime.MinValue,
        });

        return Ok(taskGetResponseDtos);
    }

    /// <inheritdoc/>
    public override async Task<IActionResult> PostTask([FromBody] TaskPostRequestDto taskPostRequestDto)
    {
        // TODO: サービスクラスでEntityからDTOに変換
        var taskEntity = new TaskEntity
        {
            Title = taskPostRequestDto.Title,
            Description = taskPostRequestDto.Description,
            DueDate = taskPostRequestDto.DueDate,
            StatusId = (int)taskPostRequestDto.StatusId,
        };

        // TODO: バリデーション
        await _taskService.CreateAsync(taskEntity);
        return Created();
    }

    /// <inheritdoc/>
    public override async Task<IActionResult> DeleteTask([FromRoute(Name = "taskId")][Required] Guid taskId)
    {
        await _taskService.DeleteAsync(taskId);
        return NoContent();
    }

    /// <inheritdoc/>
    public override async Task<IActionResult> GetTask([FromRoute(Name = "taskId")][Required] Guid taskId)
    {
        var task = await _taskService.FindByIdAsync(taskId);

        // TODO: サービスクラスでEntityからDTOに変換
        var taskGetResponseDto = new TaskGetResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            StatusId = (StatusIdEnum)task.StatusId,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
        };
        return Ok(taskGetResponseDto);
    }

    /// <inheritdoc/>
    public override async Task<IActionResult> PutTask([FromRoute(Name = "taskId")][Required] Guid taskId, [FromBody] TaskPutRequestDto taskPutRequestDto)
    {
        // TODO: サービスクラスでEntityからDTOに変換
        var taskEntity = new TaskEntity
        {
            Title = taskPutRequestDto.Title,
            Description = taskPutRequestDto.Description,
            DueDate = taskPutRequestDto.DueDate,
            StatusId = (int)taskPutRequestDto.StatusId,
        };

        // TODO: バリデーション
        await _taskService.UpdateAsync(taskId, taskEntity);
        return NoContent();
    }
}
