using Core.Entities;
using Core.Validators;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Birthday
{
    public class BirthdayResponse
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public DateOnly BirthDate { get; set; }
        public string? Image { get; set; }
        public string Type { get; set; }
        public int Age { get; set; }
        public int DayBeforeBirthday { get; set; }
    }
}
