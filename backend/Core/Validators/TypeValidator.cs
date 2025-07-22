using Core.Consts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Validators
{
    public class TypeValidator : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var myObject = value.ToString();
            if (!TypesConst.Types.Any(myObject.Contains))
            {
                return new ValidationResult("Not correct category");
            }
            return ValidationResult.Success;
        }
    }
}
