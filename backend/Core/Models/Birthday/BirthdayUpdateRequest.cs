using Core.Entities;
using Core.Validators;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Core.Models.Birthday
{
    public class BirthdayUpdateRequest
    {
        public string Name { get; set; }
        public DateOnly BirthDate { get; set; }
        public IFormFile? ImageFile { get; set; }
        [TypeValidator]
        public string Type { get; set; }
        public bool RemoveImage { get; set; }
    }
}
