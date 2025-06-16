using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Org.OpenAPITools.Controllers;
using Org.OpenAPITools.Models;
using ToDoApp.Application.Interfaces.IService;

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
        var tasks = await _taskService.SearchAsync();
        return Ok(tasks);
    }

    /// <inheritdoc/>
    public override async Task<IActionResult> PostTask([FromBody] TaskPostRequestDto taskPostRequestDto)
    {
        await _taskService.CreateAsync(taskPostRequestDto);
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
        return Ok(task);
    }

    /// <inheritdoc/>
    public override async Task<IActionResult> PutTask([FromRoute(Name = "taskId")][Required] Guid taskId, [FromBody] TaskPutRequestDto taskPutRequestDto)
    {
        await _taskService.UpdateAsync(taskId, taskPutRequestDto);
        return NoContent();
    }
}
