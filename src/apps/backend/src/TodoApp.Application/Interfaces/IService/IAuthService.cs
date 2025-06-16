using Org.OpenAPITools.Models;

namespace TodoApp.Application.Interfaces.IService;

public interface IAuthService
{
    Task<UserLoginResponseDto> LoginAsync(UserLoginRequestDto userLoginRequestDto);
}
