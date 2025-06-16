using ToDoApp.Domain.Entities; // Required for UserEntity in RegisterUserAsync

namespace ToDoApp.Application.Interfaces.IService;

public interface IUserService
{
    Task<UserEntity> GetUserByIdAsync(Guid id);

    Task RegisterUserAsync(UserEntity userEntity, string password);
}
