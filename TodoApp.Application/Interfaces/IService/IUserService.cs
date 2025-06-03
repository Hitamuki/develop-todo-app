using TodoApp.Application.DTOs;
using Domain.Entities; // Required for UserEntity in RegisterUserAsync

namespace TodoApp.Application.Interfaces.IService;

public interface IUserService
{
    Task<UserDto> GetUserByIdAsync(Guid id);
    Task<UserDto> GetUserByUserNameAsync(string userName);
    Task RegisterUserAsync(UserEntity user, string password);
}
