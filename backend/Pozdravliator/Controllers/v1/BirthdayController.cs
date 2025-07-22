using Core.Interfaces.Services;
using Core.Models.Birthday;
using Core.Models.Filter;
using Core.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Pozdravliator.Controllers.v1
{
    [ApiController]
    [Route("birthdays")]
    public class BirthdayController : CustomControllerBase
    {
        private readonly IBirthdayService _birthdayService;

        public BirthdayController(IBirthdayService birthdayService)
        {
            _birthdayService = birthdayService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBirthdayById(int id)
        {
            var result = await _birthdayService.GetBirthdayByIdAsync(id);

            return result.IsSuccess
                ? Ok(ApiResult.CreateSuccess(result.Data))
                : StatusCode(result.Error.ErrorCode, ApiResult.CreateFailure(result.Error.ErrorMessage));

        }
        [HttpGet]
        public async Task<IActionResult> GetBirthdays([FromQuery] int curPage = 1, int pageSize = 15)
        {
            var pag = new Pagination
            {
                Page = curPage,
                PageSize = pageSize
            };
            var result = await _birthdayService.GetBirthdaysAsync(pag, UserId.Value);

            return result.IsSuccess
                ? Ok(ApiResult.CreateSuccess(result.Data))
                : StatusCode(result.Error.ErrorCode, ApiResult.CreateFailure(result.Error.ErrorMessage));
        }
        [HttpPost("create")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateBirthday([FromForm] BirthdayAddRequest request, int userId = 1)//НЕ ЗАБУДЬ ПОМЕНЯТЬ, КОГДА JWT ПОДКЛЮЧИШЬ!
        {
            var result = await _birthdayService.AddBirthdayAsync(request, userId);

            return result.IsSuccess
                ? Ok(ApiResult.CreateSuccess(result.Data))
                : StatusCode(result.Error.ErrorCode, ApiResult.CreateFailure(result.Error.ErrorMessage));
        }

        [HttpPut("update/{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateBirthday([FromForm] BirthdayUpdateRequest request, long id)
        {
            var result = await _birthdayService.UpdateBirthdayAsync(request, id);

            return result.IsSuccess
                ? Ok(ApiResult.CreateSuccess(result.Data))
                : StatusCode(result.Error.ErrorCode, ApiResult.CreateFailure(result.Error.ErrorMessage));
        }
        [HttpGet("by-month")]
        public async Task<IActionResult> GetBirthdaysByMonth(int month)
        {
            var result = await _birthdayService.BirthdayForCalendar(month);

            return result.IsSuccess
                ? Ok(ApiResult.CreateSuccess(result.Data))
                : StatusCode(result.Error.ErrorCode, ApiResult.CreateFailure(result.Error.ErrorMessage));
        }
        [HttpPost("by-filter")]
        public async Task<IActionResult> GetBirthdaysByFilter(BirthdayFilterRequest fil)
        {
            var result = await _birthdayService.GetBirthdaysByFilterAsync(fil, UserId.Value);

            return result.IsSuccess
                ? Ok(ApiResult.CreateSuccess(result.Data))
                : StatusCode(result.Error.ErrorCode, ApiResult.CreateFailure(result.Error.ErrorMessage));
        }
        [HttpDelete]
        public async Task<IActionResult> DeleteBirthday(int id)
        {
            var result = await _birthdayService.RemoveBirthday(id);

            return result.IsSuccess
                ? Ok(ApiResult.CreateSuccess(result.Data))
                : StatusCode(result.Error.ErrorCode, ApiResult.CreateFailure(result.Error.ErrorMessage));
        }
    }
}
