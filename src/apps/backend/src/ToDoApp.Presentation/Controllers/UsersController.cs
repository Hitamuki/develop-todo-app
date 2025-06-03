using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TodoApp.Application.DTOs; // For UserDto as response
using TodoApp.Application.DTOs.Request; // For UserRegistrationRequestDto
using TodoApp.Application.Interfaces.IService;

namespace ToDoApp.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService ?? throw new ArgumentNullException(nameof(userService));
    }

    // GET api/users/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserDto>> GetUserById(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    // GET api/users/username/{userName}
    [HttpGet("username/{userName}")]
    public async Task<ActionResult<UserDto>> GetUserByUserName(string userName)
    {
        var user = await _userService.GetUserByUserNameAsync(userName);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    // POST api/users
    [HttpPost]
    public async Task<ActionResult<UserDto>> RegisterUser([FromBody] UserRegistrationRequestDto registrationRequest)
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
            UserName = registrationRequest.UserName,
            Email = registrationRequest.Email
            // Id, PasswordHash, CreatedAt, UpdatedAt will be set in UserService
        };

        try
        {
            await _userService.RegisterUserAsync(userEntity, registrationRequest.Password);
        }
        catch (Exception ex) // Replace with more specific exception handling
        {
            // Log error
            return BadRequest(new { message = "Registration failed.", details = ex.Message }); // Avoid sending raw exception details in prod
        }

        // Fetch the created user to return it (or have RegisterUserAsync return it)
        // For simplicity, let's assume registrationRequest.UserName is unique and usable for retrieval here.
        // A more robust approach would be for RegisterUserAsync to return the created UserEntity/UserDto or its Id.
        var createdUser = await _userService.GetUserByUserNameAsync(userEntity.UserName);
        if (createdUser == null)
        {
             // This case should ideally not happen if registration was successful and transactional
            return Problem("User was registered but could not be retrieved immediately.");
        }

        // Return 201 Created with the location of the new resource and the resource itself
        return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
    }
}
