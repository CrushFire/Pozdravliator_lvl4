using AutoMapper;
using Core.Entities;
using Core.Models.Birthday;

namespace Pozdravliator.Mappers
{
    public class AutoMapper : Profile
    {
        public AutoMapper()
        {
            CreateMap<Birthday, BirthdayResponse>()
                .ForMember(dest => dest.Age,
                opt => opt.MapFrom(src => (DateTime.Today - src.BirthDate.ToDateTime(TimeOnly.MinValue)).Days / 360 + 1))
                .ForMember(dest => dest.DayBeforeBirthday,
                opt => opt.MapFrom(src =>
                    ((new DateTime(DateTime.Today.Year, src.BirthDate.Month, src.BirthDate.Day) < DateTime.Today)
                        ? new DateTime(DateTime.Today.Year + 1, src.BirthDate.Month, src.BirthDate.Day)
                        : new DateTime(DateTime.Today.Year, src.BirthDate.Month, src.BirthDate.Day)
                    ).Subtract(DateTime.Today).Days));

            CreateMap<BirthdayAddRequest, Birthday>();

            CreateMap<BirthdayUpdateRequest, Birthday>();
        }
    }
}
