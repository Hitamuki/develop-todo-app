using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Org.OpenAPITools.Controllers;
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
  public override async Task<IActionResult> Gets()
  {
    IEnumerable<TaskEntity> tasks = await _taskService.GetAllAsync();
    // TODO: サービスクラスでEntityからDTOに変換
    var taskGetResponseDtos = tasks.Select(task => new TaskGetResponseDto
    {
      Title = task.Title,
      Description = task.Description,
      DueDate = task.DueDate ?? DateTime.MinValue,
      StatusId = (StatusIdEnum)task.StatusId,
      CreatedAt = task.CreatedAt ?? DateTime.MinValue,
      UpdatedAt = task.UpdatedAt ?? DateTime.MinValue,
    });

    return Ok(taskGetResponseDtos);
  }

  /// <inheritdoc/> 
  public override async Task<IActionResult> Post([FromBody] TaskPostRequestDto taskPostRequestDto)
  {
    return Created();
  }

  /// <inheritdoc/> 
  public override async Task<IActionResult> Delete([FromRoute(Name = "taskId")][Required] Guid taskId)
  {
    return NoContent();
  }

  /// <inheritdoc/> 
  public override async Task<IActionResult> Get([FromRoute(Name = "taskId")][Required] Guid taskId)
  {
    var task = await _taskService.GetByIdAsync(taskId);

    // TODO: サービスクラスでEntityからDTOに変換
    var taskGetResponseDto = new TaskGetResponseDto
    {
      Title = task.Title,
      Description = task.Description,
      DueDate = task.DueDate ?? DateTime.MinValue,
      StatusId = (StatusIdEnum)task.StatusId,
      CreatedAt = task.CreatedAt ?? DateTime.MinValue,
      UpdatedAt = task.UpdatedAt ?? DateTime.MinValue,
    };
    return Ok(taskGetResponseDto);
  }

  /// <inheritdoc/> 
  public override async Task<IActionResult> Put([FromRoute(Name = "taskId")][Required] Guid taskId)
  {
    return NoContent();
  }

}