public interface ITaskRepository
{
    Task<IEnumerable<TaskEntity>> GetAllAsync();
}