namespace ToDoApp.Application.Interfaces.IService;

public interface IJwtService
{
    string GenerateToken(string userId, string email);
}
