using Core.Models.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Results
{
    public class ApiResult
    {
        public bool Success { get; set; }
        public object? Data { get; set; }
        public ErrorApiResponse? Error { get; set; }

        public static ApiResult CreateSuccess(object? data = null)
        {
            return new ApiResult { Success = true, Data = data, Error = null };
        }

        public static ApiResult CreateFailure(string errorMessage)
        {
            return new ApiResult { Success = false, Data = null, Error = new ErrorApiResponse(errorMessage) };
        }
    }
}
