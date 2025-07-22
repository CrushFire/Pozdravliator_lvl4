using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Api
{
    public class ErrorResponse
    {
        public string ErrorMessage { get; set; }
        public int ErrorCode { get; set; }
        public ErrorResponse(string errorMessage, int errorCode)
        {
            ErrorMessage = errorMessage;
            ErrorCode = errorCode;
        }
    }
}
