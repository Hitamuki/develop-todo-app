using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using TodoApp.Application.Interfaces.IService;

namespace ToDoApp.Presentation.Controllers;

[ApiController]
[Route("[controller]")]
public class TasksController : ControllerBase
{
  private readonly ITaskService _taskService;

  public TasksController(ITaskService taskService)
  {
    _taskService = taskService;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<TaskEntity>>> GetAll() // ResponseDtoに変更
  {
    var tasks = await _taskService.GetAllAsync();
    return Ok(tasks);
  }
}
