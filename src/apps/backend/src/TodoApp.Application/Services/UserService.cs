using Microsoft.AspNetCore.Identity; // Required for IPasswordHasher
using ToDoApp.Application.Interfaces.IService;
using ToDoApp.Domain.Entities;
using ToDoApp.Domain.Interfaces.IRepository;

namespace ToDoApp.Application.Services;

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

    public async Task<UserEntity> GetUserByIdAsync(Guid id)
    {
        var userEntity = await _userRepository.GetByIdAsync(id);
        if (userEntity == null)
        {
            return null;
        }
        return userEntity;
    }

    public async Task RegisterUserAsync(UserEntity userEntity, string password)
    {
        // ハッシュ方式：PBKDF2 (Password-Based Key Derivation Function 2)、ハッシュ関数：HMAC-SHA256、ソルト、ストレッチング
        userEntity.PasswordHash = _passwordHasher.HashPassword(userEntity, password);
        userEntity.CreatedAt = DateTime.UtcNow;
        userEntity.UpdatedAt = DateTime.UtcNow;
        userEntity.Id = Guid.NewGuid();

        await _userRepository.AddAsync(userEntity);
    }
}
