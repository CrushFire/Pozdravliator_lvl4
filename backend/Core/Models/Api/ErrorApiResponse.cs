using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Api
{
    public class ErrorApiResponse
    {
        public string ErrorMessage { get; set; }
        public ErrorApiResponse(string errorMessage)
        {
            ErrorMessage = errorMessage;
        }
    }
}
