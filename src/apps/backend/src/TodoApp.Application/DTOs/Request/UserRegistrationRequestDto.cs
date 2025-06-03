using System.ComponentModel.DataAnnotations;

namespace TodoApp.Application.DTOs.Request;

public class UserRegistrationRequestDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string UserName { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 8)] // Example password policy
    public string Password { get; set; }
}
