using Microsoft.AspNetCore.Mvc;
using Org.OpenAPITools.Controllers;
using Org.OpenAPITools.Models;

namespace ToDoApp.Presentation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : AuthApiController
    {
        public override async Task<IActionResult> Login([FromBody] UserLoginRequestDto userLoginRequestDto)
        {
            return Ok();
        }
    }
}
