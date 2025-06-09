using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.OpenAPITools.Controllers;

namespace TodoApp.Presentation.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : AuthApiController
    {
        public override async Task<IActionResult> Login([FromBody]UserLoginRequestDto userLoginRequestDto)
        {
        }
    }
}
