using Microsoft.AspNetCore.Mvc;
// using YourNamespace.Models; // モデル層の名前空間を指定
// using YourNamespace.Services; // サービス層の名前空間を指定

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
    public async Task<ActionResult<IEnumerable<YourModel>>> GetAll()
    {
        var tasks = await _taskService.GetAllAsync();
        return Ok(tasks);
    }
}
