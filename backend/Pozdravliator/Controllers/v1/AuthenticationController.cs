using Core.Interfaces.Services;
using Core.Models.Authentication;
using Core.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Net.WebSockets;

namespace Pozdravliator.Controllers.v1
{
    [ApiController]
    [Route("authentication")]
    public class AuthenticationController : CustomControllerBase
    {
        private readonly IAutenticationService _authenticationService;

        public AuthenticationController(IAutenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost("registration")]
        public async Task<IActionResult> Registration([FromBody] RegistrationRequest req)
        {
            var result = await _authenticationService.RegistrationAsync(req);

            return result.IsSuccess
                ? Ok(ApiResult.CreateSuccess(new { Token = result.Data.token }))
                : StatusCode(result.Error.ErrorCode, ApiResult.CreateFailure(result.Error.ErrorMessage));
        }

        [HttpPost("authorization")]

        public async Task<IActionResult> Authorization([FromBody] AuthorizationRequest req)
        {
            var result = await _authenticationService.AuthorizationAsync(req);

            return result.IsSuccess
                ? Ok(ApiResult.CreateSuccess(new { Token = result.Data.token }))
                : StatusCode(result.Error.ErrorCode, ApiResult.CreateFailure(result.Error.ErrorMessage));
        }
    }
}
