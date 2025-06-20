namespace ToDoApp.Application.Interfaces
{
    public interface IUserContext
    {
        string? UserId { get; }
        bool IsAuthenticated { get; }
    }
}