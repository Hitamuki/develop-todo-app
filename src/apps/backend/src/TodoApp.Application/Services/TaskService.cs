public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository todoRepository)
    {
        _taskRepository = todoRepository;
    }

    public async Task<IEnumerable<Task>> GetAllAsync()
    {
        return await _taskRepository.GetAllAsync();
    }
}