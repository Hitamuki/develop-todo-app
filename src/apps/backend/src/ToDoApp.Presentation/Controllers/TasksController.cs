using System.ComponentModel.DataAnnotations;
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
    var tasks = await _taskService.GetAllAsync();
    // TODO: サービスクラスでEntityからDTOに変換
    return Ok(new List<TaskGetResponseDto>());
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
    return Ok();
  }

  /// <inheritdoc/> 
  public override async Task<IActionResult> Put([FromRoute(Name = "taskId")][Required] Guid taskId)
  {
    return NoContent();
  }

}
