using Microsoft.AspNetCore.Mvc;
using Org.OpenAPITools.Controllers;
using Org.OpenAPITools.Models;
using ToDoApp.Application.Interfaces.IService;
using ToDoApp.Domain.Entities;

namespace ToDoApp.Presentation.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : UsersApiController
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService ?? throw new ArgumentNullException(nameof(userService));
    }

    public override async Task<IActionResult> GetUser(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        var userGetResponseDto = new UserGetResponseDto
        {
            Id = user.Id,
            Name = user.UserName,
            Email = user.Email,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
        return Ok(userGetResponseDto);
    }

    public override async Task<IActionResult> PostUser([FromBody] UserPostRequestDto userPostRequestDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Consider mapping UserRegistrationRequestDto to UserEntity if structure differs significantly
        // or if UserEntity has more properties to be set by default.
        // For now, direct creation for simplicity.
        var userEntity = new UserEntity
        {
            UserName = userPostRequestDto.Name,
            Email = userPostRequestDto.Email
            // Id, PasswordHash, CreatedAt, UpdatedAt will be set in UserService
        };

        try
        {
            await _userService.RegisterUserAsync(userEntity, userPostRequestDto.Password);
        }
        catch (Exception ex) // Replace with more specific exception handling
        {
            // Log error
            return BadRequest(new { message = "Registration failed.", details = ex.Message }); // Avoid sending raw exception details in prod
        }

        // Return 201 Created
        return Created();
    }
}
