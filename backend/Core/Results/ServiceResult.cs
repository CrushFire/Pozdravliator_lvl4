using Core.Models.Api;

namespace Core.Results
{
    public class ServiceResult<T>
    {
        public bool IsSuccess {  get; set; }
        public T? Data { get; set; }
        public ErrorResponse? Error { get; set; } = null!;

        public static ServiceResult<T> Suc(T? data = default)
        {
            return new ServiceResult<T> { IsSuccess = true, Data = data, Error = null};
        }

        public static ServiceResult<T> Fail(string error, int statusCode = 400)
        {
            return new ServiceResult<T> { IsSuccess = false, Data = default, Error = new ErrorResponse(error, statusCode) };
        }
    }
}
