using Microsoft.AspNetCore.Mvc;
using Org.OpenAPITools.Controllers;
using Org.OpenAPITools.Models;
using TodoApp.Application.Interfaces.IService;

namespace ToDoApp.Presentation.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : AuthApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    public override async Task<IActionResult> Login([FromBody] UserLoginRequestDto userLoginRequestDto)
    {
        var response = await _authService.LoginAsync(userLoginRequestDto);
        return Ok(response);
    }
}
