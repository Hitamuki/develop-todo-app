using Org.OpenAPITools.Models;

namespace ToDoApp.Application.Interfaces.IService;

public interface ITaskService
{
    /// <summary>
    /// すべてのタスクを取得する
    /// </summary>
    /// <returns>すべてのタスク</returns>
    Task<IEnumerable<TaskGetResponseDto>> SearchAsync();

    Task<TaskGetResponseDto> FindByIdAsync(Guid id);

    Task CreateAsync(TaskPostRequestDto taskPostRequestDto);

    Task UpdateAsync(Guid id, TaskPutRequestDto taskPutRequestDto);

    Task DeleteAsync(Guid id);
}
