using Core.Validators;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Filter
{
    public class BirthdayFilterRequest
    {
        [TimeIntervalValiudator]
        public string TimeInterval { get; set; } = "Неделя";
        public string? BirthdayType { get; set; }
        [RegularExpression(@"^(ask|desk)$", ErrorMessage = "SortDirectionIsInValid")]
        public string DirectionSort { get; set; } = "desk";
        public string? Name { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; }
    }
}
