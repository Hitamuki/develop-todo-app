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
  public override async Task<IActionResult> TasksGet()
  {
    var tasks = await _taskService.GetAllAsync();
    // TODO: サービスクラスでEntityからDTOに変換
    return Ok(new List<Org.OpenAPITools.Models.Task>());
  }

  /// <inheritdoc/> 
  public override async Task<IActionResult> TasksPost([FromBody] TaskCreate taskCreate)
  {
    return Created();
  }

  /// <inheritdoc/> 
  public override async Task<IActionResult> TasksTaskIdDelete([FromRoute(Name = "taskId")][Required] Guid taskId)
  {
    return NoContent();
  }

  /// <inheritdoc/> 
  public override async Task<IActionResult> TasksTaskIdGet([FromRoute(Name = "taskId")][Required] Guid taskId)
  {
    return Ok();
  }

  /// <inheritdoc/> 
  public override async Task<IActionResult> TasksTaskIdPut([FromRoute(Name = "taskId")][Required] Guid taskId)
  {
    return NoContent();
  }

}
