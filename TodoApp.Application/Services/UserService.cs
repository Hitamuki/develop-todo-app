using Domain.Entities;
using Microsoft.AspNetCore.Identity; // Required for IPasswordHasher
using TodoApp.Application.DTOs;
using TodoApp.Application.Interfaces.IService;
using TodoApp.Domain.Interfaces.IRepository;
using ToDoApp.Infrastructure.Mappers;

namespace TodoApp.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<UserEntity> _passwordHasher;

    public UserService(
        IUserRepository userRepository,
        IPasswordHasher<UserEntity> passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<UserDto> GetUserByIdAsync(Guid id)
    {
        var userEntity = await _userRepository.GetByIdAsync(id);
        if (userEntity == null)
        {
            return null;
        }
        return UserMapper.ToDto(userEntity);
    }

    public async Task<UserDto> GetUserByUserNameAsync(string userName)
    {
        var userEntity = await _userRepository.GetByUserNameAsync(userName);
        if (userEntity == null)
        {
            return null;
        }
        return UserMapper.ToDto(userEntity);
    }

    public async Task RegisterUserAsync(UserEntity userEntity, string password)
    {
        // Ensure UserName is unique if necessary (database constraint or check here)
        // Ensure Email is unique if necessary (database constraint or check here)

        userEntity.PasswordHash = _passwordHasher.HashPassword(userEntity, password);
        userEntity.CreatedAt = DateTime.UtcNow;
        userEntity.UpdatedAt = DateTime.UtcNow;
        userEntity.Id = Guid.NewGuid();

        await _userRepository.AddAsync(userEntity);
    }
}
