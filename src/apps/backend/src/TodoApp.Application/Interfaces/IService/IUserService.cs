using TodoApp.Domain.Entities; // Required for UserEntity in RegisterUserAsync

namespace TodoApp.Application.Interfaces.IService;

public interface IUserService
{
    Task<UserEntity> GetUserByIdAsync(Guid id);
    Task<UserEntity> GetUserByUserNameAsync(string userName);
    Task RegisterUserAsync(UserEntity user, string password);
}
