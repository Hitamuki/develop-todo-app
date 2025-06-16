using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Org.OpenAPITools.Models;
using TodoApp.Application.Interfaces.IService;
using ToDoApp.Application.Interfaces.IService;
using ToDoApp.Domain.Entities;
using ToDoApp.Domain.Interfaces.IRepository;

namespace ToDoApp.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<UserEntity> _passwordHasher;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher<UserEntity> passwordHasher,
        IJwtService jwtService,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
        _logger = logger;
    }

    public async Task<UserLoginResponseDto> LoginAsync(UserLoginRequestDto userLoginRequestDto)
    {
        var user = await _userRepository.GetByEmailAsync(userLoginRequestDto.Email);

        // パスワード照合
        var matchingResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, userLoginRequestDto.Password);
        if (matchingResult == PasswordVerificationResult.Success)
        {
            // JWTトークン発行
            return new()
            {
                Id = user.Id,
                Email = user.Email,
                AccessToken = _jwtService.GenerateToken(user.Id.ToString(), user.Email),
            };
        }
        else
        {
            // パスワード不一致。ログイン失敗
            // TODO: 例外処理
            return null;
        }
    }
}
