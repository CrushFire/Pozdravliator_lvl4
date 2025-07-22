using Core.Consts;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Validators
{
    public class TimeIntervalValiudator : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var myObject = value.ToString();
            if (!TimeIntervalsConst.Types.Any(myObject.Contains))
            {
                return new ValidationResult("Not correct time interval");
            }
            return ValidationResult.Success;
        }
    }
}
