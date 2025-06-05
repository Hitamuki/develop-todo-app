using TodoApp.Domain.Entities; // Required for UserEntity in RegisterUserAsync

namespace TodoApp.Application.Interfaces.IService;

public interface IUserService
{
    Task<UserEntity> GetUserByIdAsync(Guid id);
    Task RegisterUserAsync(UserEntity userEntity, string password);
}
